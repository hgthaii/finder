import express from 'express'
import mongoose from 'mongoose'
import http from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import routes from './src/routes/index.js'
import { Server } from 'socket.io'

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
    },
}
const server = http.createServer(app)
const port = process.env.PORT || 5000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use('/api/v1', routes)

const io = new Server(server)


io.on('connection', (socket) => {
    console.log('Socket is connected!')
    socket.on('disconnect', () => {
        console.log('Socket disconnected!')
    })
})

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('MongoDB is connected!')
        server.listen(port, () => {
            console.log(`Server is running on ${port}`)
        })
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error)
        process.exit(1)
    })