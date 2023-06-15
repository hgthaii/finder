import { Server } from 'socket.io'

// Tạo một hàm middleware cho Socket.IO
const socketIOMiddleware = (server) => {
    // Khởi tạo Socket.IO và gắn nó vào server
    const io = new Server(server)

    // Middleware chạy trước khi xử lý các sự kiện của Socket.IO
    io.use((socket, next) => {
        // Thực hiện xử lý middleware tại đây (nếu cần)
        // Ví dụ: Kiểm tra xác thực, lưu trữ thông tin người dùng, v.v.
        console.log('Socket.IO middleware')
        next()
    })

    // Xử lý các sự kiện từ client
    io.on('connection', (socket) => {
        // Xử lý các sự kiện tại đây
        // Ví dụ: nhận dữ liệu từ client, gửi dữ liệu cho client, v.v.
        console.log('Socket.IO connection')
    })
}

export default socketIOMiddleware
