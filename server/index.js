import express from "express"
import session from 'express-session'
import mongoose from "mongoose"
import http from "http"
import cors from "cors"
import cookieParser from "cookie-parser"
import "dotenv/config"
import routes from "./src/routes/index.js"
import socketIOMiddleware from './src/middlewares/socket.middleware.js'

const app = express()

const whitelist = [
    'https://finder-client-hgthaii.vercel.app',
    'http://localhost:3000',
    'https://finder-api-hgthaii.vercel.app',
    'https://finder-payment.onrender.com',
    'https://sandbox.vnpayment.vn',
    'https://www.findermovie.me',
    'https://findermovie.me',
    'http://finder-client-git-master-hgthaii.vercel.app',
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
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use("/api/v1", routes)

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