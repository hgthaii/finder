import responseHandler from '../handlers/response.handler.js'
import genreModel from '../models/genre.model.js'
import movieModel from '../models/movie.model.js'
import castModel from '../models/cast.model.js'
import qs from 'qs'

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
        const { search: searchQuery } = qs.parse(req.query, { delimiter: ' ' })
        if (!searchQuery || typeof searchQuery !== 'string' || searchQuery.trim() === '') {
            return responseHandler.badrequest(res, 'Tiêu đề không hợp lệ.')
        }
        const regex = new RegExp(searchQuery, 'i') // Tạo biểu thức chính quy

        const query = {
            $or: [
                { title: { $regex: regex } },
                { 'genres.name': { $regex: regex } },
                { 'cast.name': { $regex: regex } },
            ],
        }

        let noResultsCount = 0 // Biến đếm số lượng model không có kết quả

        const movieQuery = movieModel.find(query)
        const genreQuery = genreModel.find(query)
        const castQuery = castModel.find(query)

        const [movies, genres, casts] = await Promise.all([movieQuery, genreQuery, castQuery])

        if (movies.length === 0) {
            noResultsCount++
        }

        if (genres.length === 0) {
            noResultsCount++
        }

        if (casts.length === 0) {
            noResultsCount++
        }

        if (noResultsCount === 3) {
            return responseHandler.badrequest(res, 'Không tìm thấy phim hoặc thể loại liên quan')
        }

        const searchData = [...movies, ...genres, ...casts]

        responseHandler.ok(res, searchData)
    } catch (error) {
        console.error(error)
        responseHandler.error(res, 'Tìm kiếm thất bại!')
    }
}



export default { getGenres, search, addGenres }
