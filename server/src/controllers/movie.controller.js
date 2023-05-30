import responseHandler from '../handlers/response.handler.js'
import commentModel from '../models/comment.model.js'
import genreModel from '../models/genre.model.js'
import movieModel from '../models/movie.model.js'

// Tạo mới một bộ phim
const createMovie = async (req, res) => {
    try {
        const {
            title,
            logo,
            duration,
            release_date,
            poster_path,
            overview,
            trailer,
            video,
            genres,
            episodes,
            casts,
            program_type,
            age_rating,
            creators,
            item_genre,
        } = req.body

        const checkTitle = await movieModel.findOne({ title })
        if (checkTitle) return responseHandler.badrequest(res, 'Phim đã tồn tại trong hệ thống!')

        const cleanField = (field) => (typeof field === 'string' ? JSON.parse(field.replace(/\\/g, '')) : field)

        const genreParse = cleanField(genres)
        const episodesParse = cleanField(episodes)
        const castsParse = cleanField(casts)
        const program_typeParse = cleanField(program_type)
        const poster_pathParse = cleanField(poster_path)
        const creatorsParse = cleanField(creators)

        const names = genreParse.map((genre) => genre.name)

        console.log(names)

        const getName = await Promise.all(
            names.map(async (name) => {
                const checkName = await genreModel.findOne({ name }).lean()
                if (!checkName) throw new Error(`Không tìm thấy thể loại trong DB.`)
                return checkName
            }),
        )

        const movie = await new movieModel({
            title,
            logo,
            duration,
            release_date,
            poster_path: poster_pathParse,
            overview,
            trailer,
            video,
            genres: getName,
            episodes: episodesParse,
            casts: castsParse,
            program_type: program_typeParse,
            age_rating,
            creators: creatorsParse,
            item_genre,
        })

        await movie.save()

        responseHandler.created(res, {
            ...movie._doc,
        })
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Thêm phim thất bại.')
    }
}

// Xóa một bộ phim
const deleteMovie = async (req, res) => {
    try {
        const { filmId } = req.params
        const movie = await movieModel.findByIdAndDelete(filmId)
        if (!movie) {
            responseHandler.notfound(res, 'Không tìm thấy thông tin phim.')
        }

        responseHandler.ok(res, {
            statusCode: 200,
            message: `Xóa thành công phim có ID: ${filmId}`,
        })
    } catch {
        responseHandler.error(res, 'Xóa phim thất bại')
    }
}

// Lấy danh sách tất cả các phim
const getAllMovies = async (req, res) => {
    try {
        const getMovie = await movieModel.find().sort('-createAt')

        responseHandler.ok(res, getMovie)
    } catch {
        responseHandler.error(res, 'Lấy danh sách phim thất bại.')
    }
}

// Lấy thông tin phim theo ID
const getMovieById = async (req, res) => {
    try {
        const { movieId } = req.params
        const movies = []
        const getMovie = await movieModel.find()
        for (const movie of getMovie) {
            if (movie.id === movieId) {
                movies.push(movie)
            }
        }
        if (!getMovie) return responseHandler.notfound(res, 'Không tìm thấy phim')
        // console.log(getMovie);
        responseHandler.ok(res, movies)
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Lấy thông tin phim thất bại.')
    }
}

const searchMovieByGenre = async (req, res) => {
    try {
        const { genreName } = req.query
        if (!genreName || typeof genreName !== 'string' || genreName.trim() === '') {
            return responseHandler.badrequest(res, 'Tiêu đề không hợp lệ.')
        }
        const isValidGenre = (genre) => {
            const regex = /^[\p{L}\d\s]+$/u
            return regex.test(genre)
        }
        if (!isValidGenre(genreName)) {
            return responseHandler.badrequest(res, 'Tên thể loại không hợp lệ')
        }
        const checkGenre = await movieModel.find({ genres: [{ name: genreName }] })
        console.log(checkGenre)
        if (!checkGenre) {
            return responseHandler.badrequest(res, 'Không tìm thấy phim.')
        }
        responseHandler.ok(res, checkGenre)
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Lấy danh sách phim không thành công!')
    }
}

// Lấy danh sách phim theo thể loại
const getAllMovieByGenre = async (req, res) => {
    try {
        const { genreId } = req.params

        // Tìm kiếm thể loại trong cơ sở dữ liệu
        const genre = await genreModel.findById(genreId)
        if (!genre) {
            return responseHandler.notfound(res, 'Không tìm thấy thể loại.')
        }

        // Tìm kiếm phim có cùng thể loại
        const movies = []
        const listMovie = await movieModel.find().sort('-createAt')

        for (const index in listMovie) {
            const movie = listMovie[index]
            if (Array.isArray(movie.genres) && movie.genres.some((g) => g && g._id && g._id.toString() === genreId)) {
                movies.push(movie)
            }
        }
        responseHandler.ok(res, movies)
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Lấy danh sách phim theo thể loại thất bại.')
    }
}

const updateMovie = async (req, res) => {
    try {
        const { movieId } = req.params
        const {
            title,
            logo,
            duration,
            release_date,
            poster_path,
            overview,
            trailer,
            video,
            genres,
            episodes,
            casts,
            program_type,
            age_rating,
            creators,
            item_genre,
        } = req.body
        const movie = await movieModel.findById(movieId)
        if (!movie) return responseHandler.notfound(res, 'Không tìm thấy phim trong hệ thống.')

        const cleanField = (field) => (typeof field === 'string' ? JSON.parse(field.replace(/\\/g, '')) : field)

        const genreParse = cleanField(genres)
        const episodesParse = cleanField(episodes)
        const castsParse = cleanField(casts)
        const program_typeParse = cleanField(program_type)
        const poster_pathParse = cleanField(poster_path)
        const creatorsParse = cleanField(creators)

        movie.title = title
        movie.logo = logo
        movie.duration = duration
        movie.release_date = release_date
        movie.poster_path = poster_pathParse
        movie.overview = overview
        movie.trailer = trailer
        movie.video = video
        movie.genres = genreParse
        movie.episodes = episodesParse
        movie.casts = castsParse
        movie.program_type = program_typeParse
        movie.age_rating = age_rating
        movie.creators = creatorsParse
        movie.item_genre = item_genre

        await movie.save()
        responseHandler.ok(res, movie)
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Update không thành công!')
    }
}

const incrementViews = async (req, res) => {
    try {
        const { movieId } = req.params
        const movie = await movieModel.findById(movieId)

        if (!movie) {
            return responseHandler.notfound(res, 'Không tìm thấy phim')
        }

        // Kiểm tra xem trường "views" đã tồn tại trong bộ phim hay chưa
        if (!movie.views) {
            movie.views = 0
        }

        // Tăng trường "views" lên 1 đơn vị
        movie.views += 1

        // Lưu bộ phim đã được cập nhật
        await movie.save()

        responseHandler.ok(res, movie)
    } catch (error) {
        console.error(error)
        responseHandler.error(res, 'Lỗi khi tăng số lượt xem')
    }
}

const getHotMovies = async (req, res) => {
    try {
        // Lấy danh sách các bộ phim được sắp xếp theo trường "views" giảm dần và giới hạn chỉ lấy 10 bộ phim đầu tiên
        const hotMovies = await movieModel.aggregate([{ $sort: { views: -1 } }, { $limit: 10 }])
        if (!hotMovies) return responseHandler.badrequest(res, 'Không có phim hot')

        responseHandler.ok(res, hotMovies)
    } catch (error) {
        console.error(error)
        responseHandler.error(res, 'Lỗi khi lấy danh sách phim hot')
    }
}

const getRandomMovies = async (req, res) => {
    try {
        // Lấy tổng số lượng bộ phim trong cơ sở dữ liệu
        const totalMovies = await movieModel.countDocuments()

        // Tạo một số ngẫu nhiên từ 0 đến tổng số lượng bộ phim
        const randomIndex = Math.floor(Math.random() * totalMovies)

        // Truy vấn ngẫu nhiên một bộ phim dựa trên số thứ tự đã tạo
        const randomMovie = await movieModel.findOne().skip(randomIndex)
        responseHandler.ok(res, randomMovie)
    } catch (error) {
        console.error(error)
        responseHandler.error(res, 'Không random được phim')
    }
}

export default {
    getAllMovies,
    getMovieById,
    searchMovieByGenre,
    getHotMovies,
    getRandomMovies,
    createMovie,
    deleteMovie,
    updateMovie,
    incrementViews,
    getAllMovieByGenre,
}
