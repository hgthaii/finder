import castModel from '../models/cast.model.js'
import movieModel from '../models/movie.model.js'
import responseHandler from '../handlers/response.handler.js'

const addCast = async (req, res) => {
    try {
        const { name } = req.body

        const checkCast = await castModel.findOne({ name })
        if (checkCast) return responseHandler.notfound(res, 'Cast đã tồn tại trong hệ thống!')

        const cast = new castModel({ name })
        await cast.save()
        responseHandler.created(res, cast)
    } catch {
        responseHandler.error(res, 'Thêm cast không thành công.')
    }
}

const getAllCasts = async (req, res) => {
    try {
        const getCast = await castModel.find().sort('-createAt')

        responseHandler.ok(res, getCast)
    } catch {
        responseHandler.error(res, 'Lấy danh sách cast thất bại!')
    }
}

const getCastById = async (req, res) => {
    try {
        const { castId } = req.params
        const checkCast = await castModel.findById(castId)
        if (!checkCast) return responseHandler.notfound(res, `Cast với ID: ${castId} không tồn tại trong hệ thống!`)
        responseHandler.ok(res, checkCast)
    } catch {
        responseHandler.error(res, 'Lấy thông tin cast thất bại!')
    }
}

const removeCast = async (req, res) => {
    try {
        const { castId } = req.params
        const checkCastId = await castModel.findByIdAndDelete(castId)
        if (!checkCastId) return responseHandler.notfound(res, `Không tìm thấy cast với ID: ${castId}`)

        responseHandler.ok(res, {
            statusCode: 200,
            message: `Xóa cast thành công!`,
        })
    } catch {
        responseHandler.error(res, 'Xóa cast không thành công.')
    }
}

const getFilmOfCast = async (req, res) => {
    try {
        const { castId } = req.params
        const cast = await castModel.findById(castId)
        if (!cast) return responseHandler.notfound(res, 'Không tìm thấy cast')
        const listMovies = []
        const getAllMovies = await movieModel.find().sort('-createdAt')
        for (const index in getAllMovies) {
            const movie = getAllMovies[index]
            if (Array.isArray(movie.casts) && movie.casts.some((g) => g && g._id && g._id.toString() === castId)) {
                listMovies.push(movie)
            }
        }

        responseHandler.ok(res, listMovies)
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Lấy danh sách phim của cast không thành công')
    }
}

const updateCast = async (req, res) => {
    try {
        const { castId } = req.params
        const { name } = req.body
        const cast = await castModel.findByIdAndUpdate(castId)
        if (!cast) return responseHandler.notfound(res, 'Không tìm thấy cast.')

        cast.name = name
        await cast.save()

        responseHandler.ok(res, cast)
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Chỉnh sửa không cast thành công.')
    }
}

const findCast = async (req, res) => {
    try {
        const { name } = req.body
        const regex = new RegExp(name.split('').join('.*'), 'i')
        const cast = await castModel.find({ name: { $regex: regex } })
        if (!cast) return responseHandler.notfound(res, 'Không tìm thấy cast!')

        responseHandler.ok(res, cast)
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Tìm cast không thành công.')
    }
}

export default {
    addCast,
    removeCast,
    getAllCasts,
    getCastById,
    getFilmOfCast,
    updateCast,
    findCast,
}
