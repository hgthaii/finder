import userModel from '../models/user.model.js'
import responseHandler from '../handlers/response.handler.js'
import config from 'config'
import axios from 'axios'
import moment from 'moment'
import tokenMiddleware from '../middlewares/token.middleware.js'

const createPaymentUrl = async (req, res) => {
    try {
        let date = new Date()
        const payment = await axios.post('https://finder-payment.onrender.com/order/create_payment_url', {
            tmnCode: config.get('vnp_TmnCode'),
            secretKey: config.get('vnp_HashSecret'),
            vnpUrl: config.get('vnp_Url'),
            returnUrl: config.get('vnp_ReturnUrl'),
            orderId: moment(date).format('DDHHmmss'),
            amount: 50000,
            bankCode: '',
            locale: 'vn',
            currCode: 'VND',
            ipAddr:
                req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress,
        })
        responseHandler.ok(res, payment.data)
    } catch (error) {
        console.error(error)
        responseHandler.error(res, 'Internal server error')
    }
}

const vnpayReturn = async (req, res) => {
    try {
        const { isVip } = req.body
        const userId = tokenMiddleware.tokenDecode(req).infor.id
        const checkUser = await userModel.findById(userId)
        if (!checkUser) return responseHandler.notfound(res, 'Không tìm thấy user.')
        if (isVip) {
            await userModel.findByIdAndUpdate(
                userId,
                { $set: { isVip: isVip } }, // Trường thông tin thanh toán
                { new: true },
            )
            responseHandler.ok(res, isVip)
        }
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Lỗi thanh toán')
    }
}

export default { createPaymentUrl, vnpayReturn }