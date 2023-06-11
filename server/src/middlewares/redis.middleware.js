import redis from 'redis'

const client = redis.createClient({
    url: 'redis://localhost:6379'
})
await client.connect()
// Middleware Redis để lấy cookie và truyền cho client
const getCookieMiddleware = (req, res, next) => {
    // Lấy cookie từ request
    const cookie = req.headers.cookie;

    // Lưu cookie vào Redis
    client.set('cookie', cookie, (err) => {
        if (err) {
            console.error('Lỗi khi lưu cookie vào Redis:', err)
            return res.status(500).send('Internal Server Error')
        }

    })
    // Chuyển tiếp yêu cầu tới middleware tiếp theo
    next()
};

await client.disconnect()

export default { getCookieMiddleware }