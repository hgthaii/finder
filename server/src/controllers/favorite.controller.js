import responseHandler from '../handlers/response.handler.js'
import favoriteModel from '../models/favorite.model.js'
import movieModel from '../models/movie.model.js'
import userModel from '../models/user.model.js'
import tokenMiddleware from '../middlewares/token.middleware.js'

const checkFavorite = async (req, res) => {
    try {
        const { movieId } = req.params
        const tokenDecoded = tokenMiddleware.tokenDecode(req)
        const userId = tokenDecoded.infor.id

        // Tìm người dùng dựa trên ID
        const user = await userModel.findById(userId)
        if (!user) {
            return responseHandler.notfound(res, 'Không tìm thấy người dùng')
        }

        // Kiểm tra xem phim đã được yêu thích bởi người dùng hay chưa
        const favorite = await favoriteModel.findOne({ userId: user._id, movieId: movieId })
        const isFavorite = !!favorite
        const favoriteId = favorite ? favorite._id : null

        if (isFavorite) {
            responseHandler.ok(res, {
                isFavorite: true,
                favoriteId: favoriteId,
                message: 'Phim đã được yêu thích.',
            })
        } else {
            responseHandler.ok(res, {
                isFavorite: false,
                message: 'Phim chưa được yêu thích.',
            })
        }
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Kiểm tra yêu thích không thành công')
    }
}


const addFavorite = async (req, res) => {
    try {
        const { movieId } = req.body
        const userId = tokenMiddleware.tokenDecode(req).infor.id

        const [checkUser, checkMovie] = await Promise.all([userModel.findById(userId), movieModel.findById(movieId)])
        if (!checkUser) return responseHandler.badrequest(res, 'User không tồn tại trong hệ thống.')
        if (!checkMovie) return responseHandler.badrequest(res, 'Phim không tồn tại trong hệ thống.')

        const isFavorite = await favoriteModel.exists({ movieId: checkMovie._id, userId: checkUser._id })
        const newFavorite = new favoriteModel({
            userId: checkUser._id,
            movieId: checkMovie._id,
            title: checkMovie.title,
            logo: checkMovie.logo,
            release_date: checkMovie.release_date,
            poster_path: checkMovie.poster_path[1].path,
            overview: checkMovie.overview,
            trailer: checkMovie.trailer,
            video: checkMovie.video,
            age_rating: checkMovie.age_rating,
            item_genre: checkMovie.item_genre,
        })
        if (isFavorite) {
            responseHandler.badrequest(res, 'Phim đã được yêu thích trước đó.')
        } else {
            await newFavorite.save()
            checkUser.favorites.push(newFavorite)
            await checkUser.save()
        }
        responseHandler.created(res, newFavorite)
    } catch (error) {
        console.error(error)
        responseHandler.error(res, 'Thêm vào yêu thích không thành công')
    }
}

const removeFavorite = async (req, res) => {
    try {
        const { favoriteId, movieId } = req.body
        const userId = tokenMiddleware.tokenDecode(req).infor.id

        const [checkUser, checkMovie] = await Promise.all([userModel.findById(userId), movieModel.findById(movieId)])
        if (!checkUser) return responseHandler.badrequest(res, 'User không tồn tại trong hệ thống.')
        if (!checkMovie) return responseHandler.badrequest(res, 'Phim không tồn tại trong hệ thống.')

        const isFavorite = await favoriteModel.exists({ movieId: checkMovie._id, userId: checkUser._id })
        if (!isFavorite) {
            return responseHandler.badrequest(res, 'Phim chưa được yêu thích.')
        }

        // Xóa phim khỏi danh sách yêu thích của người dùng
        const index = checkUser.favorites.indexOf(isFavorite._id)
        console.log(index)
        if (index > -1) {
            checkUser.favorites.splice(index, 1)
            await checkUser.save()
        } else {
            return responseHandler.badrequest(res, 'Xoá favorite user không thành công.')
        }

        await favoriteModel.findOneAndDelete({ movieId: checkMovie._id, userId: checkUser._id })

        responseHandler.ok(res, {
            statusCode: 200,
            message: 'Xóa khỏi danh sách yêu thích thành công.',
        })
    } catch (error) {
        console.error(error)
        responseHandler.error(res, 'Xóa khỏi danh sách yêu thích không thành công.')
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

export default { addFavorite, removeFavorite, getFavoritesOfUser, checkFavorite }
