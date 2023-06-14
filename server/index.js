import express from "express"
import session from 'express-session'
import mongoose from "mongoose"
import http from "http"
import cors from "cors"
import cookieParser from "cookie-parser"
import "dotenv/config"
import routes from "./src/routes/index.js"
import { Server } from 'socket.io'

const app = express()

const whitelist = ['https://finder-client-zeta.vercel.app', 'http://localhost:3000', 'https://finder-sooty.vercel.app']
const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
            if (!origin || whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Trang web này bị block bởi CORS!'))
            }
        }
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors(corsOptions))
app.use("/api/v1", routes)

const server = http.createServer(app)
const io = new Server(server)
const port = process.env.PORT || 5000

io.use((socket, next) => {
    next()
})

io.on(
    'connection',
    (socket) => {
        console.log('Client đã kết nối')
        // Xử lý sự kiện khi có bình luận mới được tạo
        // socket.on('getLatestComments', async (comment) => {
        //     // Lấy các comment mới nhất từ cơ sở dữ liệu hoặc từ nguồn dữ liệu khác
        //     const latestComments = await commentModel.findById(comment).sort('-createdAt')
        //     console.log(comment);
        //     // Gửi các comment mới nhất tới client
        //     socket.emit('latestComments', latestComments);
        // })
        // Xử lý sự kiện khi ngắt kết nối WebSocket
        socket.on('disconnect', () => {
            console.log('Kết nối WebSocket đã bị ngắt.')
        })
    }
)

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