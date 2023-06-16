import tokenMiddleware from '../middlewares/token.middleware.js'
import userModel from '../models/user.model.js'
import commentModel from '../models/comment.model.js'
import responseHandler from '../handlers/response.handler.js'
import movieModel from '../models/movie.model.js'
// import { io } from '../../index.js'

const createComment = async (req, res) => {
    try {
        const tokenDecoded = tokenMiddleware.tokenDecode(req)
        const { content, movieId } = req.body
        if (!movieId) return responseHandler.badrequest(res, 'Không tìm thấy phim!')

        const userId = tokenDecoded.infor.id
        if (!userId) return responseHandler.badrequest(res, 'Không tìm thấy user!')
        const checkUser = await userModel.findById(userId).select('displayName avatar username')
        if (!checkUser) return responseHandler.badrequest(res, 'Không tìm thấy user')
        const checkMovie = await movieModel.findById(movieId)
        if (!checkMovie) return responseHandler.badrequest(res, 'Không tìm thấy phim')

        // Kiểm tra nội dung bình luận chỉ chứa chữ cái và dấu cách
        const isValidComment = (comment) => {
            const regex =
                /^[a-zA-Z0-9\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ\s]*$/u
            return regex.test(comment)
        }
        // Kiểm tra nội dung bình luận hợp lệ
        if (!isValidComment(content)) {
            return responseHandler.badrequest(res, 'Nội dung bình luận không hợp lệ')
        }

        if (content === '') return responseHandler.badrequest(res, 'Không được bình luận có nội dung trống')

        const comment = new commentModel({
            content: content,
            user: {
                userId,
                displayName: checkUser.displayName,
                avatar: checkUser.avatar,
            },
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
        // io.on('connection', (socket) => {
        //     console.log('getAllCommentOfFilm đã kết nối')
        //     socket.emit('latestComments', getComment)
        // })
        responseHandler.ok(res, getComment)
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Lấy danh sách bình luận không thành công!')
    }
}

const getAllCommentOfUser = async (req, res) => {
    try {
        const tokenDecoded = tokenMiddleware.tokenDecode(req)

        const userId = tokenDecoded.infor.id
        if (!userId) return responseHandler.badrequest(res, 'Không tìm thấy user!')
        const checkUser = await userModel.findById(userId)
        if (!checkUser) return responseHandler.badrequest(res, 'Không tìm thấy user')

        const getComments = await commentModel.find({ 'user.userId': userId }).sort('-createdAt')
        responseHandler.ok(res, getComments)
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Lấy danh sách bình luận không thành công!')
    }
}

const editComment = async (req, res) => {
    try {
        const { commentId } = req.params
        const { content } = req.body
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

const editReplyComment = async (req, res) => {
    try {
        const { commentId } = req.params
        const { content } = req.body
        if (!commentId) return responseHandler.badrequest(res, 'Bình luận không tồn tại!')
        const tokenDecoded = tokenMiddleware.tokenDecode(req)
        const userId = await userModel.findById(tokenDecoded.infor.id)
        if (!userId) return responseHandler.badrequest(res, 'Người dùng không tồn tại!')

        const checkComment = await commentModel.findOne({ 'replies._id': commentId })

        if (!checkComment) return responseHandler.badrequest(res, 'Bình luận không tồn tại!')

        let foundReply = null

        for (let i = 0; i < checkComment.replies.length; i++) {
            if (checkComment.replies[i]._id.toString() === commentId) {
                foundReply = checkComment.replies[i]
                break
            }
        }

        foundReply.content = content || foundReply.content
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
        const userId = tokenMiddleware.tokenDecode(req).infor.id
        const checkComment = await commentModel.findById(commentId)

        if (!checkComment) {
            return responseHandler.badrequest(res, 'Bình luận không tồn tại!')
        }

        if (checkComment.user.userId !== userId) {
            return responseHandler.badrequest(res, 'Bạn không có quyền xoá bình luận này!')
        }

        await commentModel.findByIdAndDelete(commentId)

        responseHandler.ok(res, {
            statusCode: 200,
            message: 'Xoá bình luận thành công!',
        })
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Xoá bình luận không thành công.')
    }
}

const deleteReplyComment = async (req, res) => {
    try {
        const { commentId, replyId } = req.params
        const userId = tokenMiddleware.tokenDecode(req).infor.id
        const checkUser = await userModel.findById(userId)
        if (!checkUser) return responseHandler.badrequest(res, 'User không tồn tại!')

        const checkComment = await commentModel.findById(commentId)
        if (!checkComment) return responseHandler.badrequest(res, 'Bình luận không tồn tại!')

        const replyIndex = checkComment.replies.findIndex((reply) => reply._id.toString() === replyId)
        if (replyIndex === -1) return responseHandler.badrequest(res, 'Bình luận phản hồi không tồn tại!')

        // Kiểm tra xem userId của bình luận phản hồi có bằng với userId hiện tại không
        if (checkComment.replies[replyIndex].userId.toString() === userId) {
            checkComment.replies.splice(replyIndex, 1)
            await checkComment.save()
            responseHandler.ok(res, {
                statusCode: 200,
                message: 'Xoá bình luận phản hồi thành công!',
            })
        } else {
            responseHandler.badrequest(res, 'Bạn không có quyền xoá bình luận phản hồi này!')
        }
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Xoá bình luận phản hồi không thành công.')
    }
}

const likeComment = async (req, res) => {
    try {
        const tokenDecoded = tokenMiddleware.tokenDecode(req)
        console.log(tokenDecoded)
        const { commentId } = req.params
        const { likedIcon } = req.body
        const userId = tokenDecoded.infor.id
        const [checkUser, checkComment] = await Promise.all([
            userModel.findById(userId),
            commentModel.findById(commentId),
        ])
        if (!checkUser) {
            return responseHandler.badrequest(res, 'Người dùng không tồn tại!')
        }
        if (!checkComment) {
            return responseHandler.badrequest(res, 'Bình luận không tồn tại!')
        }

        // Kiểm tra xem người dùng đã thích bình luận này trước đó chưa
        const likedByUser = checkComment.likes.some((like) => like.userId === userId)

        if (likedByUser) {
            return responseHandler.badrequest(res, 'Bạn đã thích bình luận này trước đó!')
        }

        // Kiểm tra tính hợp lệ của icon
        const isValidIcon = [1100, 1101, 1102, 1103, 1104, 1105].includes(Number(likedIcon))
        if (!isValidIcon) {
            return responseHandler.badrequest(res, 'Icon không hợp lệ!')
        }

        // Thêm lượt thích mới vào danh sách likes
        checkComment.likes.push({ userId, likedIcon })

        await checkComment.save()

        responseHandler.ok(res, {
            statusCode: 200,
            message: 'Thích bình luận thành công!',
        })
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Thích bình luận không thành công!')
    }
}

const likeReplyComment = async (req, res) => {
    try {
        const tokenDecoded = tokenMiddleware.tokenDecode(req)
        const { commentId } = req.params
        const { likedIcon } = req.body
        const userId = tokenDecoded.infor.id

        const [checkUser, checkComment] = await Promise.all([
            userModel.findById(userId),
            commentModel.findOne({ 'replies._id': commentId }).select('replies'),
        ])
        if (!checkUser) {
            return responseHandler.badrequest(res, 'Người dùng không tồn tại!')
        }
        if (!checkComment) {
            return responseHandler.badrequest(res, 'Bình luận không tồn tại!')
        }

        let foundReply = null

        for (let i = 0; i < checkComment.replies.length; i++) {
            if (checkComment.replies[i]._id.toString() === commentId) {
                foundReply = checkComment.replies[i]
                break
            }
        }

        // Kiểm tra xem người dùng đã thích bình luận này trước đó chưa
        let foundUserId = null
        for (let i = 0; i < foundReply.likes.length; i++) {
            if (foundReply.likes[i].userId === userId) {
                foundUserId = foundReply.likes[i]
                break
            }
        }

        if (foundUserId !== null) {
            return responseHandler.badrequest(res, 'Bạn đã thích bình luận này trước đó!')
        }

        // Kiểm tra tính hợp lệ của icon
        const isValidIcon = [1100, 1101, 1102, 1103, 1104, 1105].includes(Number(likedIcon))
        if (!isValidIcon) {
            return responseHandler.badrequest(res, 'Icon không hợp lệ!')
        }

        // Thêm lượt thích mới vào danh sách likes
        foundReply.likes.push({ userId, likedIcon })

        await checkComment.save()

        responseHandler.ok(res, {
            statusCode: 200,
            message: 'Thích bình luận thành công!',
        })
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Thích bình luận không thành công!')
    }
}

const unlikeComment = async (req, res) => {
    try {
        const tokenDecoded = tokenMiddleware.tokenDecode(req)
        const { commentId } = req.params
        const userId = tokenDecoded.infor.id

        const [checkUser, checkComment] = await Promise.all([
            userModel.findById(userId),
            commentModel.findById(commentId),
        ])

        if (!checkUser) {
            return responseHandler.badrequest(res, 'Người dùng không tồn tại!')
        }
        if (!checkComment) {
            return responseHandler.badrequest(res, 'Bình luận không tồn tại!')
        }

        // Kiểm tra xem người dùng đã thích bình luận này trước đó chưa
        const likedByUser = checkComment.likes.some((like) => like.userId.toString() === userId)
        if (!likedByUser) {
            return responseHandler.badrequest(res, 'Người dùng chưa thích bình luận này!')
        }

        // Xoá lượt thích của người dùng khỏi danh sách likes
        checkComment.likes = checkComment.likes.filter((like) => {
            return !(like.userId.toString() === userId)
        })

        await checkComment.save()

        responseHandler.ok(res, {
            statusCode: 200,
            message: 'Bỏ thích bình luận thành công!',
        })
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Bỏ thích bình luận không thành công!')
    }
}

const unlikeReplyComment = async (req, res) => {
    try {
        const tokenDecoded = tokenMiddleware.tokenDecode(req)
        const { commentId } = req.params
        const userId = tokenDecoded.infor.id

        const [checkUser, checkComment] = await Promise.all([
            userModel.findById(userId),
            commentModel.findOne({ 'replies._id': commentId }).select('replies'),
        ])

        if (!checkUser) {
            return responseHandler.badrequest(res, 'Người dùng không tồn tại!')
        }
        if (!checkComment) {
            return responseHandler.badrequest(res, 'Bình luận không tồn tại!')
        }

        let foundReply = null

        for (let i = 0; i < checkComment.replies.length; i++) {
            if (checkComment.replies[i]._id.toString() === commentId) {
                foundReply = checkComment.replies[i]
                break
            }
        }

        // Kiểm tra xem người dùng đã thích bình luận này trước đó chưa
        let foundUserId = null
        for (let i = 0; i < foundReply.likes.length; i++) {
            if (foundReply.likes[i].userId === userId) {
                foundUserId = foundReply.likes[i]
                break
            }
        }

        if (foundUserId === null) {
            return responseHandler.badrequest(res, 'Bạn chưa thích bình luận này!')
        }

        // Xoá lượt thích của người dùng khỏi danh sách likes
        foundReply.likes = foundReply.likes.filter((like) => {
            return !(like.userId === userId)
        })

        await checkComment.save()

        responseHandler.ok(res, {
            statusCode: 200,
            message: 'Bỏ thích bình luận thành công!',
        })
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Bỏ thích bình luận không thành công!')
    }
}

const changeLikedIcon = async (req, res) => {
    try {
        const tokenDecoded = tokenMiddleware.tokenDecode(req)
        const { commentId } = req.params
        const { newLikedIcon } = req.body
        const userId = tokenDecoded.infor.id

        const [checkUser, checkComment] = await Promise.all([
            userModel.findById(userId),
            commentModel.findById(commentId),
        ])

        if (!checkUser) {
            return responseHandler.badrequest(res, 'Người dùng không tồn tại!')
        }
        if (!checkComment) {
            return responseHandler.badrequest(res, 'Bình luận không tồn tại!')
        }

        // Kiểm tra xem người dùng đã thích bình luận này trước đó chưa
        const likedByUser = checkComment.likes.find((like) => like.userId.toString() === userId)
        if (!likedByUser) {
            return responseHandler.badrequest(res, 'Người dùng chưa thích bình luận này!')
        }

        // Kiểm tra tính hợp lệ của icon mới
        const isValidNewIcon = [1100, 1101, 1102, 1103, 1104, 1105].includes(Number(newLikedIcon))
        if (!isValidNewIcon) {
            return responseHandler.badrequest(res, 'Icon mới không hợp lệ!')
        }
        // Thay đổi icon trong lượt thích của người dùng
        likedByUser.likedIcon = newLikedIcon

        await checkComment.save()

        responseHandler.ok(res, {
            statusCode: 200,
            message: 'Thay đổi icon thành công!',
        })
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Thay đổi icon không thành công!')
    }
}

const changeLikedReplyIcon = async (req, res) => {
    try {
        const tokenDecoded = tokenMiddleware.tokenDecode(req)
        const { commentId } = req.params
        const { newLikedIcon } = req.body
        const userId = tokenDecoded.infor.id

        const [checkUser, checkComment] = await Promise.all([
            userModel.findById(userId),
            commentModel.findOne({ 'replies._id': commentId }).select('replies'),
        ])

        if (!checkUser) {
            return responseHandler.badrequest(res, 'Người dùng không tồn tại!')
        }
        if (!checkComment) {
            return responseHandler.badrequest(res, 'Bình luận không tồn tại!')
        }

        let foundReply = null

        for (let i = 0; i < checkComment.replies.length; i++) {
            if (checkComment.replies[i]._id.toString() === commentId) {
                foundReply = checkComment.replies[i]
                break
            }
        }

        // Kiểm tra xem người dùng đã thích bình luận này trước đó chưa
        let foundUserId = null
        for (let i = 0; i < foundReply.likes.length; i++) {
            if (foundReply.likes[i].userId === userId) {
                foundUserId = foundReply.likes[i]
                break
            }
        }

        if (foundUserId === null) {
            return responseHandler.badrequest(res, 'Bạn chưa thích bình luận này!')
        }

        // Kiểm tra tính hợp lệ của icon mới
        const isValidNewIcon = [1100, 1101, 1102, 1103, 1104, 1105].includes(Number(newLikedIcon))
        if (!isValidNewIcon) {
            return responseHandler.badrequest(res, 'Icon mới không hợp lệ!')
        }
        // Thay đổi icon trong lượt thích của người dùng
        foundUserId.likedIcon = newLikedIcon

        await checkComment.save()

        responseHandler.ok(res, {
            statusCode: 200,
            message: 'Thay đổi icon thành công!',
        })
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Thay đổi icon không thành công!')
    }
}

const replyToComment = async (req, res) => {
    try {
        const tokenDecoded = tokenMiddleware.tokenDecode(req)
        const { commentId } = req.params
        const { content } = req.body
        const userId = tokenDecoded.infor.id

        const [checkUser, checkComment] = await Promise.all([
            userModel.findById(userId),
            commentModel.findById(commentId),
        ])

        if (!checkUser) return responseHandler.badrequest(res, 'Người dùng không tồn tại!')
        if (!checkComment) return responseHandler.badrequest(res, 'Bình luận không tồn tại!')

        const reply = {
            content: content,
            userId: userId,
        }

        checkComment.replies.push(reply)
        await checkComment.save()

        responseHandler.ok(res, {
            statusCode: 200,
            message: 'Phản hồi bình luận thành công!',
        })
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Reply không thành công.')
    }
}

const getLikesComment = async (req, res) => {
    try {
        const { commentId } = req.params
        if (!commentId) return responseHandler.badrequest(res, 'ID bình luận không được trống.')
        const comment = await commentModel.findById(commentId).select('likes')
        if(!comment) return responseHandler.notfound(res, 'Bình luận không tồn tại.')
        responseHandler.ok(res, comment)
    } catch (error) {
        console.log(error);
        responseHandler.error(res, 'Không tìm thấy bình luận.')
    }
}


const GetLikesReplyComment = async (req, res) => {
    try {
        const { commentId } = req.params
        const checkComment = await commentModel.findById(commentId).select('replies')
        if (!checkComment) return responseHandler.badrequest(res, 'Bình luận không tồn tại!')

        responseHandler.ok(res, checkComment.replies)
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Reply không thành công.')
    }
}

export default {
    createComment,
    editComment,
    deleteComment,
    getAllCommentOfFilm,
    likeComment,
    replyToComment,
    unlikeComment,
    unlikeReplyComment,
    changeLikedIcon,
    likeReplyComment,
    changeLikedReplyIcon,
    editReplyComment,
    deleteReplyComment,
    getAllCommentOfUser,
    getLikesComment,
    GetLikesReplyComment,
}
