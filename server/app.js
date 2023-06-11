    import express from "express"
    import session from 'express-session'
    import mongoose from "mongoose"
    import http from "http"
    import cors from "cors"
    import cookieParser from "cookie-parser"
    import "dotenv/config"
    import routes from "./src/routes/index.js"
    import {Server} from 'socket.io'

    const app = express()
    
    const whitelist = ['http://localhost:3000', 'https://api-hgthaii.vercel.app']
    const corsOptions = {
        credentials: true,
        origin: (origin, callback) => {
                if (!origin || whitelist.indexOf(origin) !== -1) {
                    callback(null, true)
                } else {
                    callback(new Error('Not allowed by CORS'))
                }
            }
    }
    // middleware
    app.use(cookieParser())
    app.use(cors(corsOptions))
    app.use(
        session({
            secret: process.env.TOKEN_SECRET,
            resave: false,
            saveUninitialized: false,
        }),
    )
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))

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

    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log('MongoDB is connected!')
            server.listen(port, () => {
                console.log(`Server is running on ${process.env.BASE_URL} at ${port}`)
            })
        })
        .catch((error) => {
            console.error("Error connecting to MongoDB:", error)
            process.exit(1)
        })