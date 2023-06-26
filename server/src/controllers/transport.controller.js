import responseHandler from '../handlers/response.handler.js'
import 'dotenv/config'
import sgMail from '@sendgrid/mail'
import ejs from 'ejs'
import fs from 'fs'
import tokenMiddleware from '../middlewares/token.middleware.js'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url'
import moment from 'moment'

const sendPaymentSuccessEmail = async (req, res) => {
    try {
        const token = req.headers['cookie']?.split(';')[3]?.split('=')[1] || req.headers['authorization']?.split(' ')[1]
        const { vnpay } = req.headers
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const tokenDecoded = tokenMiddleware.tokenDecode(req)
        const displayName = tokenDecoded.infor.displayName
        const email = tokenDecoded.infor.email
        const currentFilePath = fileURLToPath(import.meta.url)
        const currentDirectoryPath = dirname(currentFilePath)
        const templatePath = path.join(currentDirectoryPath, '..', 'assets', 'html', 'email.ejs')
        const template = fs.readFileSync(templatePath, 'utf-8')
        const data = {
            displayName,
            vnp_Amount: vnpay.vnp_Amount / 100 + ' ' + vnpay.vnp_CurrCode,
            vnp_CreateDate: moment(vnpay.vnp_CreateDate, 'YYYYMMDDHHmmss')
                .utcOffset('+07:00')
                .format('YYYY-MM-DD HH:mm:ss'),
            vnp_IpAddr: vnpay.vnp_IpAddr.split('%2C+')[0],
            vnp_TxnRef: vnpay.vnp_TxnRef,
        }
        const html = ejs.render(template, data)

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
    } catch (error) {
        console.log(error);
        responseHandler.error(res, 'Gửi mail không thành công.')
    }
}
export default { sendPaymentSuccessEmail }
