import userModel from '../models/user.model.js'
import responseHandler from '../handlers/response.handler.js'
import config from 'config'
import axios from 'axios'
import moment from 'moment'
import tokenMiddleware from '../middlewares/token.middleware.js'
import transportController from '../controllers/transport.controller.js'

const createPaymentUrl = async (req, res, next) => {
    try {
        let date = new Date()
        const accessToken = req.headers['authorization']
        const token = accessToken.split(' ')[1]
        const payment = await axios.post(
            'https://finder-payment.onrender.com/order/create_payment_url',
            {
                tmnCode: 'ZFOUCS77',
                secretKey: 'QXESFFFHTPUPZADYFLZXHBEWIZGKXNQC',
                vnpUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
                returnUrl: 'https://findermovie.me/vnpay_return',
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
            },
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            },
        )
        const arr = payment.data.split('?')[1].split('&')
        const vnpay = {}
        arr.forEach((item) => {
            const [key, value] = item.split('=')
            vnpay[key] = value
        })
        req.headers.vnpay = vnpay

        responseHandler.ok(res, payment.data)
        next(req, res)
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
            transportController.sendPaymentSuccessEmail(req, res)
            responseHandler.ok(res, isVip)
        }
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Lỗi thanh toán')
    }
}

export default { createPaymentUrl, vnpayReturn }