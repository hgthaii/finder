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

const getFilmOfGenre = async (req, res) => {
    try {
        const { genreId } = req.params
        const checkGenre = await genreModel.findById(genreId)
        if (!checkGenre) return responseHandler.notfound(res, 'Không tìm thấy thể loại trong hệ thống.')
        const listMovies = []
        const getAllMovies = await movieModel.find().sort('-createdAt')
        for (const index in getAllMovies) {
            const movie = getAllMovies[index]
            if (Array.isArray(movie.genres) && movie.genres.some((g) => g && g._id && g._id.toString() === genreId)) {
                listMovies.push(movie)
            }
        }

        responseHandler.ok(res, listMovies)
    } catch (error) {
        // console.log(error)
        responseHandler.error(res, 'Lấy danh sách phim từ thể loại thất bại')
    }
}

const search = async (req, res) => {
    try {
        const { title } = req.query
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return responseHandler.badrequest(res, 'Tiêu đề không hợp lệ.')
        }
        const regex = new RegExp(title, 'i') // Tạo biểu thức chính quy
        const checkTitle = await movieModel.find({ title: { $regex: regex } })
        if (!checkTitle) {
            return responseHandler.badrequest(res, 'Không tìm thấy phim.')
        }

        responseHandler.ok(res, checkTitle)
    } catch (error) {
        console.error(error)
        responseHandler.error(res, 'Tìm kiếm thất bại!')
    }
}

export default { getGenres, search, addGenres, getFilmOfGenre }
