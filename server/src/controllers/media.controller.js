import responseHandler from '../handlers/response.handler.js'
import genreModel from '../models/genre.model.js'
import movieModel from '../models/movie.model.js'

const addGenres = async (req, res) => {
    try {
        const { name } = req.body
        const checkName = await genreModel.findOne({ name })

        if (checkName) return responseHandler.badrequest(res, 'Tên thể loại đã tồn tại!')

        const genre = await new genreModel({ name })

        try {
            await genre.save()
        } catch (error) {
            console.log(error)
        }

        responseHandler.created(res, genre)
    } catch {
        responseHandler.error(res, 'Thêm thể loại thất bại!')
    }
}

const getGenres = async (req, res) => {
    try {
        const response = await genreModel.find()

        return responseHandler.ok(res, response)
    } catch {
        responseHandler.error(res, 'Lấy danh sách thể loại thất bại!')
    }
}

const search = async (req, res) => {
    try {
        const { title } = req.query
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return responseHandler.badrequest(res, 'Tiêu đề không hợp lệ.')
        }
        const regex = new RegExp(title, 'i') // Tạo biểu thức chính quy

        const query = {
            $or: [
                { title: { $regex: regex } },
                { 'genres.name': { $regex: regex } },
                { 'cast.name': { $regex: regex } },
            ],
        }

        const checkTitle = await movieModel.find(query)
        if (!checkTitle) {
            return responseHandler.badrequest(res, 'Không tìm thấy phim hoặc thể loại liên quan')
        }

        responseHandler.ok(res, checkTitle)
    } catch (error) {
        console.error(error)
        responseHandler.error(res, 'Tìm kiếm thất bại!')
    }
}

export default { getGenres, search, addGenres }
