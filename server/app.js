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

const whitelist = ['http://localhost:3000', 'http://localhost:88']
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
// middleware
// app.use(
//     session({
//         secret: process.env.TOKEN_SECRET,
//         resave: false,
//         saveUninitialized: false,
//     }),
// )
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors(corsOptions))

app.use("/api/v1", routes)

const server = http.createServer(app)
export const io = new Server(server)
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

function parseCookies(request) {
    const list = {}
    const cookieHeader = request.headers?.cookie
    if (!cookieHeader) return list

    cookieHeader.split(`;`).forEach(function (cookie) {
        let [name, ...rest] = cookie.split(`=`)
        name = name?.trim()
        if (!name) return
        const value = rest.join(`=`).trim()
        if (!value) return
        list[name] = decodeURIComponent(value)
    })

    return list
}

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDB is connected!')
        server.listen(port, (req, res) => {
            const cookies = parseCookies(req)
            res.send(JSON.stringify(cookies))
            console.log(cookies);
            console.log(`Server is running on ${port}`)
        })
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error)
        process.exit(1)
    })