import nodemailer from 'nodemailer'
import responseHandler from '../handlers/response.handler.js'
import 'dotenv/config'

const transporter = nodemailer.createTransport({
    host: 'smtp.forwardemail.net', // Tên máy chủ SMTP của bạn
    port: 587, // Cổng máy chủ SMTP
    secure: false, // Sử dụng kết nối bảo mật SSL/TLS (nếu cần thiết)
    auth: {
        user: process.env.EMAIL, // Địa chỉ email của bạn
        pass: process.env.PASSWORD_EMAIL, // Mật khẩu email của bạn
    },
})

const sendPaymentSuccessEmail = (req, res, next) => {
    // Lấy thông tin về thanh toán từ req.body hoặc req.params tùy thuộc vào cách bạn truyền dữ liệu
    const { paymentInfo } = req.body

    const mailOptions = {
        from: process.env.EMAIL, // Địa chỉ email gửi
        to: 'phungtranhoangthai@gmail.com', // Địa chỉ email nhận
        subject: 'Payment Success', // Chủ đề email
        text: `Payment was successful. Payment info: ${paymentInfo}`, // Nội dung email dạng văn bản
    }

    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Lỗi khi gửi mail:', error)
            responseHandler.error(res, 'Lỗi khi gửi mail')
        } else {
            console.log('Email sent:', info.response)
            responseHandler.ok(res, 'Gửi mail thành công!')
            next()
        }
    })
}

export default {sendPaymentSuccessEmail}
