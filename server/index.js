import express from "express"
import session from 'express-session'
import mongoose from "mongoose"
import http from "http"
import https from 'https'
import cors from "cors"
import cookieParser from "cookie-parser"
import "dotenv/config"
import routes from "./src/routes/index.js"
import axios from 'axios'
import socketIOMiddleware from './src/middlewares/socket.middleware.js'

const app = express()

const whitelist = [
    'https://finder-client-hgthaii.vercel.app',
    'http://localhost:3000',
    'https://finder-api-hgthaii.vercel.app',
    'https://vnpay-gpw7.onrender.com',
    'https://sandbox.vnpayment.vn',
]
const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
            if (!origin || whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                console.log('Trang web này bị block bởi CORS!')
                callback(new Error('Trang web này bị block bởi CORS!'))
            }
        }
}
const agent = new https.Agent({
    rejectUnauthorized: false, // Vô hiệu hóa xác minh chứng chỉ SSL
})
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors(corsOptions))
app.use("/api/v1", routes)
// app.all('/api/*', async (req, res) => {
//     try {
//         const { method, url, body } = req

//         const response = await axios({
//             method,
//             url: `http://localhost:8888/${url}`, // Thay đổi địa chỉ API cần gọi
//             data: body,
//             headers: req.headers,
//             maxRedirects: 0,
//             httpsAgent: agent,
//         })

        
//             if (response.status === 404) {
//                 // Chuyển hướng tới link được trả về từ server
//                 const redirectUrl = response.headers.location
//                 window.location.href = redirectUrl
//             } else {
//                 // Xử lý khi không nhận được kết quả thành công từ server
//                 toast.error('Có lỗi xảy ra trong quá trình tạo thanh toán')
//             }

//         res.status(response.status).send(response.data)
//     } catch (error) {
//         if (error.response) {
//             res.status(error.response.status).send(error.response.data)
//         } else {
//             console.log(error)
//             res.status(500).send('Internal Server Error')
//         }
//     }
// })

const server = http.createServer(app)
const port = process.env.PORT || 5000
socketIOMiddleware(server)

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDB is connected!')
        server.listen(port, () => {
            console.log(`Server is running on ${port}`)
        })
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error)
        process.exit(1)
    })