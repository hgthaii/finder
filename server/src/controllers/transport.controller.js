import responseHandler from '../handlers/response.handler.js'
import 'dotenv/config'
import sgMail from '@sendgrid/mail'
import tokenMiddleware from '../middlewares/token.middleware.js'
import moment from 'moment'

const sendPaymentSuccessEmail = async (req, res) => {
    try {
        const vnpay = JSON.parse(req.headers.vnpay)
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const tokenDecoded = tokenMiddleware.tokenDecode(req)
        const { displayName, username } = tokenDecoded.infor
        const email = tokenDecoded.infor.email
        const data = {
            displayName,
            username,
            vnp_Amount: vnpay.vnp_Amount / 100 + ' VND',
            vnp_BankCode: vnpay.vnp_BankCode,
            vnp_BankTranNo: vnpay.vnp_BankTranNo,
            vnp_CardType: vnpay.vnp_CardType,
            vnp_TransactionNo: vnpay.vnp_TransactionNo,
            vnp_OrderInfo: vnpay.vnp_OrderInfo,
            vnp_CreateDate: moment(vnpay.vnp_PayDate, 'YYYYMMDDHHmmss')
                .utcOffset('+07:00')
                .format('YYYY-MM-DD HH:mm:ss'),
        }
        const html = `<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f1f1f1;">
    <div style="max-width: 600px; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); color: #333;">
        <h1 style="color: #000; text-align: center; margin-top: 0; margin-bottom: 30px; font-size: 28px;">Cảm ơn bạn đã đăng ký VIP Member</h1>
        <p>Xin chào, <span style="font-weight: bold;">${data.displayName}</span></p>
        <p>Cảm ơn bạn đã đăng ký chương trình VIP Member của Finder. Chúng tôi rất vui mừng chào đón bạn và hy vọng bạn sẽ có những trải nghiệm tuyệt vời với dịch vụ của chúng tôi.</p>
        <p>Với tư cách là thành viên VIP, bạn sẽ được hưởng nhiều ưu đãi đặc biệt như:</p>
        <ul style="margin-bottom: 20px; padding-left: 20px; list-style-type: disc;">
            <li>Truy cập vào nội dung VIP của Finder</li>
            <li>Tham gia các sự kiện, chương trình khuyến mãi độc quyền</li>
            <li>Nhận thông báo về các bộ phim mới, cập nhật từ chúng tôi</li>
        </ul>
        <p>Hãy truy cập website findermovie.me để khám phá thêm các tính năng và nội dung độc quyền dành cho thành viên VIP.</p>
        <p>Xin cảm ơn bạn một lần nữa và hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi hoặc yêu cầu nào.</p>
        <p>Trân trọng,</p>
        <p>Đội ngũ <span style="font-weight: bold;">Finder</span></p>

        <h2 style="color: #000; font-weight: bold;">Thông tin đơn hàng:</h2>
        <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
            <tr>
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f5f5f5; font-weight: normal;">Số tiền giao dịch</th>
                <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${data.vnp_Amount}</td>
            </tr>
            <tr>
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f5f5f5; font-weight: normal;">Tài khoản giao dịch</th>
                <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${data.username}</td>
            </tr>
            <tr>
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f5f5f5; font-weight: normal;">Mã ngân hàng</th>
                <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${data.vnp_BankCode}</td>
            </tr>
            <tr>
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f5f5f5; font-weight: normal;">Nội dung giao dịch</th>
                <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${data.vnp_OrderInfo}</td>
            </tr>
            <tr>
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f5f5f5; font-weight: normal;">Hình thức giao dịch</th>
                <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${data.vnp_CardType}</td>
            </tr>
            <tr>
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f5f5f5; font-weight: normal;">Mã giao dịch</th>
                <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${data.vnp_BankTranNo}</td>
            </tr>
            <tr>
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f5f5f5; font-weight: normal;">Ngày giao dịch</th>
                <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${data.vnp_CreateDate}</td>
            </tr>
        </table>
    </div>
</body>
`

        const msg = {
            to: email,
            from: process.env.FROM_EMAIL,
            subject: 'Đăng ký VIP Member thành công!',
            // text: 'and easy to do anywhere, even with Node.js',
            html: html,
        }
        await sgMail.send(msg)
        // responseHandler.ok(res, {
        //     statusCode: 200,
        //     message: 'Gửi mail thành công!',
        // })
        console.log('Gửi mail thành công!');
    } catch (error) {
        console.log(error);
        // responseHandler.error(res, 'Gửi mail không thành công.')
    }
}
export default { sendPaymentSuccessEmail }
