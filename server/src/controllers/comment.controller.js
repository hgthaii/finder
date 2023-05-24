import tokenMiddleware from '../middlewares/token.middleware.js'
import userModel from '../models/user.model.js'
import commentModel from '../models/comment.model.js'
import responseHandler from '../handlers/response.handler.js'
import movieModel from '../models/movie.model.js'
import { io } from '../../app.js'

const createComment = async (req, res) => {
    try {
        const tokenDecoded = tokenMiddleware.tokenDecode(req)
        const { content, movieId } = req.body
        if (!movieId) return responseHandler.badrequest(res, 'Không tìm thấy phim!')

        const userId = tokenDecoded.infor.id
        if (!userId) return responseHandler.badrequest(res, 'Không tìm thấy user!')
        const checkUser = await userModel.findById(userId)
        if (!checkUser) return responseHandler.badrequest(res, 'Không tìm thấy user')

        const checkMovie = await movieModel.findById(movieId)
        if (!checkMovie) return responseHandler.badrequest(res, 'Không tìm thấy phim')

        // Kiểm tra nội dung bình luận chỉ chứa chữ cái và dấu cách
        const isValidComment = (comment) => {
            const regex = /^[\p{L}\d\s]+$/u
            return regex.test(comment)
        }
        // Kiểm tra nội dung bình luận hợp lệ
        if (!isValidComment(content)) {
            return responseHandler.badrequest(res, 'Nội dung bình luận không hợp lệ')
        }

        if (content === '') return responseHandler.badrequest(res, 'Không được bình luận có nội dung trống')

        const comment = new commentModel({
            content: content,
            userId,
            movieId,
        })

        await comment.save()

        responseHandler.created(res, {
            statusCode: 201,
            message: 'Bình luận thành công.',
        })
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Bình luận không thành công!')
    }
}

const getAllCommentOfFilm = async (req, res) => {
    try {
        const { movieId } = req.params
        const checkMovie = await movieModel.findById(movieId)

        if (!checkMovie) return responseHandler.badrequest(res, 'Phim không tồn tại!')

        const getComment = await commentModel.find({ movieId }).sort('-createdAt')
        io.on('connection', (socket) => {
            console.log('getAllCommentOfFilm đã kết nối')
            socket.emit('latestComments', getComment)
        })
        responseHandler.ok(res, getComment)
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Lấy danh sách bình luận không thành công!')
    }
}

const editComment = async (req, res) => {
    try {
        const { commentId, content } = req.body
        if (!commentId) return responseHandler.badrequest(res, 'Bình luận không tồn tại!')
        const tokenDecoded = tokenMiddleware.tokenDecode(req)
        const userId = await userModel.findById(tokenDecoded.infor.id)
        if (!userId) return responseHandler.badrequest(res, 'Người dùng không tồn tại!')

        const checkComment = await commentModel.findById(commentId).select('content userId movieId updatedAt')
        if (!checkComment) return responseHandler.badrequest(res, 'Bình luận không tồn tại!')

        checkComment.content = content || checkComment.content
        await checkComment.save()

        responseHandler.ok(res, checkComment)
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Chỉnh sửa comment không thành công.')
    }
}

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params
        const checkComment = await commentModel.findByIdAndDelete(commentId)
        if (!checkComment) return responseHandler.badrequest(res, 'Bình luận không tồn tại!')

        responseHandler.ok(res, {
            statusCode: 200,
            message: 'Xoá bình luận thành công!',
        })
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Xoá comment không thành công.')
    }
}

export default { createComment, editComment, deleteComment, getAllCommentOfFilm }
