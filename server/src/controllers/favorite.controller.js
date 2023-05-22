import responseHandler from '../handlers/response.handler.js'
import favoriteModel from '../models/favorite.model.js'
import movieModel from '../models/movie.model.js'
import tokenMiddleware from '../middlewares/token.middleware.js'

const addFavorite = async (req, res) => {
    try {
        const { movieId } = req.body
        if (!movieId) return responseHandler.badrequest(res, 'Không tìm thấy phim')
        const tokenDecoded = tokenMiddleware.tokenDecode(req)
        const userId = tokenDecoded.infor.id
        const movie = await movieModel.findById(movieId).select('title poster_path id overview trailer')
        if (!movie) return responseHandler.badrequest(res, 'Không tìm thấy phim')
        const isFavorite = await favoriteModel.findOne({ movieId })
        // Tìm xem movie này đã được thêm vào yêu thích chưa

        // Nếu tồn tại, trả về code 200
        if (isFavorite) return responseHandler.badrequest(res, 'Phim đã được thêm vào yêu thích trước đó')

        // Nếu movie này chưa có trong danh sách yêu thích, tạo một đối tượng mới
        const favorite = new favoriteModel({
            ...req.body,
            title: movie.title,
            poster_path: movie.poster_path[1].path,
            overview: movie.overview,
            trailer: movie.trailer,
            userId,
        })

        await favorite.save()

        return responseHandler.created(res, favorite)
    } catch (error) {
        console.error(error)
        responseHandler.error(res, 'Thêm vào yêu thích không thành công')
    }
}

const removeFavorite = async (req, res) => {
    try {
        const { favoriteId } = req.body
        if (!favoriteId) return responseHandler.badrequest(res, 'Không tìm thấy phim trong hệ thống')
        const userId = tokenMiddleware.tokenDecode(req).infor.id
        const favorite = await favoriteModel.findOneAndDelete({ _id: favoriteId, userId })
        if (!favorite) return responseHandler.notfound(res, 'Không tìm thấy phim đã yêu thích.')

        // Xóa đối tượng yêu thích
        responseHandler.ok(res, {
            statusCode: 200,
            message: `Xoá phim đã yêu thích thành công!`,
        })
    } catch (error) {
        // console.log(error)
        responseHandler.error(res, 'Xóa khỏi yêu thích không thành công')
    }
}

// Lấy danh sách các phim yêu thích của user
const getFavoritesOfUser = async (req, res) => {
    try {
        const userId = tokenMiddleware.tokenDecode(req).infor.id
        if (!userId) return responseHandler.notfound(res, 'Không tìm thấy user')
        // Tìm user và sắp xếp kết quả theo thứ tự từ mới đến cũ
        const favorite = await favoriteModel.find({ userId }).sort('-createdAt')
        if (!favorite) return responseHandler.notfound(res, `Không tìm thấy danh sách yêu thích của user`)
        responseHandler.ok(res, favorite)
    } catch (error) {
        // console.log(error);
        responseHandler.error(res, 'Lấy danh sách yêu thích người dùng không thành công')
    }
}

export default { addFavorite, removeFavorite, getFavoritesOfUser }
