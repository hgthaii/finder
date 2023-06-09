import rateLimit from 'express-rate-limit'
import responseHandler from '../handlers/response.handler.js'

// Tạo middleware giới hạn tốc độ bình luận
const rateLimitMiddleware = (windowMs, maxRequests) => {
    const limiter = rateLimit({
        windowMs: windowMs, // Thời gian giới hạn
        max: maxRequests, // Số lượng yêu cầu tối đa cho phép trong khoảng thời gian
        message: {
            error: 'Bạn đã vượt quá giới hạn yêu cầu bình luận!',
            nextValidRequestTime: new Date(Date.now() + windowMs).toLocaleTimeString(),
        },
        // headers: true,
        handler: (req, res, next) => {
            const timeToReset = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
            responseHandler.toomanyrequests(
                res,
                `Vui lòng đợi ${timeToReset} giây trước khi gửi yêu cầu bình luận tiếp theo.`,
                new Date(Date.now() + timeToReset * 1000).toLocaleTimeString(),
            )
        },
    })
    return limiter
}

export default rateLimitMiddleware
