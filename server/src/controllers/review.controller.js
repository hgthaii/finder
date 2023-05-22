import responseHandler from '../handlers/response.handler.js'
import reviewModel from '../models/review.model.js'
import userModel from '../models/user.model.js'

// Tạo đánh giá phim
const create = async (req, res) => {
    try {
        const { movieId } = req.params
        const review = new reviewModel({
            user: req.user.id,
            movieId,
            ...req.body,
        })
        const { _id, ...decreaseId } = review._doc

        await review.save()

        responseHandler.created(res, {
            ...decreaseId, // Lấy toàn bộ thông tin của đối tượng review (trừ id) và sao chép vào object trả về
            id: review.id,
            user: req.user, // Thêm thuộc tính user chứa thông tin của user đang thực hiện request vào object trả về
        })
    } catch {
        responseHandler.error(res, 'Tạo đánh giá thất bại.')
    }
}

// Xoá đánh giá
const remove = async (req, res) => {
    try {
        const { reviewId } = req.params

        var review = await reviewModel.findByIdAndDelete({
            _id: reviewId,
            user: req.user.id,
        })

        if (!review) return responseHandler.notfound(res, 'Không tìm thấy đánh giá.')

        responseHandler.ok(res, {
            statusCode: 200,
            message: 'Xóa đánh giá thành công!',
        })
    } catch {
        responseHandler.error(res, 'Xóa đánh giá thất bại.')
    }
}

// Lấy tất cả các đánh giá của user
const getReviewsOfUser = async (req, res) => {
    try {
        // Lấy các document của một user cụ thể
        const reviews = await reviewModel
            .find({
                user: req.user.id,
            })
            .sort('-createAt')
        return responseHandler.ok(res, reviews)
    } catch {
        responseHandler.error(res, 'Lấy danh sách đánh giá phim thất bại.')
    }
}

export default { create, remove, getReviewsOfUser }
