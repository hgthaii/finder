import express from "express"
import mongoose from "mongoose"
import http from "http"
import cors from "cors"
import cookieParser from "cookie-parser"
import "dotenv/config"
import routes from "./src/routes/index.js"

const app = express()

// middleware
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use("/api/v1", routes)

const server = http.createServer(app)
const port = process.env.PORT || 5000

// Connect MongoDB
const db = mongoose.connection;
db.on("error", (error) => {
    console.error("connection error:", error);
});

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDB is connected!')
        server.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`)
        })
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error)
        process.exit(1)
    })