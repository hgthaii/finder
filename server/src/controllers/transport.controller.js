import nodemailer from 'nodemailer'
import responseHandler from '../handlers/response.handler.js'

const sendEmail = async (req, res) => {
    try {
        const { recipient, subject, content } = req.body

        // Khởi tạo transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'hoangthai.txt@gmail.com', // Tài khoản Gmail của bạn
                pass: 'thajlh123', // Mật khẩu Gmail của bạn
            },
        })

        // Tạo options cho email
        const mailOptions = {
            from: 'hoangthai.txt@gmail.com',
            to: recipient,
            subject: subject,
            text: content,
        }

        // Gửi email
        const info = await transporter.sendMail(mailOptions)
        console.log('Email sent: ' + info.response)
        responseHandler.ok(res, info)
    } catch (error) {
        console.error('Error sending email:', error)
        responseHandler.error(res, 'Error sending email.')
    }
}

export default { sendEmail }
