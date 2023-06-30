import responseHandler from '../handlers/response.handler.js'
import { EventEmitter } from 'events'
import tokenMiddleware from '../middlewares/token.middleware.js'
import userModel from '../models/user.model.js'
import { Server } from 'socket.io'

const eventEmitter = new EventEmitter()
let io

// Thiết lập socket.io
const setupSocketIO = (server) => {
    io = new Server(server)

    // Lắng nghe sự kiện kết nối của người dùng
    io.on('connection', (socket) => {
        console.log('Người dùng đã kết nối:', socket.id)

        // Ngắn kết nối khi người dùng disconnect
        socket.on('disconnect', () => {
            console.log('Người dùng đã ngắt kết nối:', socket.id)
        })
    })
}

const adminPushNotify = async (req, res) => {
    try {
        const { title, content } = req.body

        // Lấy danh sách tất cả người dùng
        const users = await userModel.find({})
        if (!users) return responseHandler.badrequest(res, 'Không tìm thấy user nào!')

        // Gửi thông báo cho mỗi người dùng trong danh sách
        for (const user of users) {
            user.notifications.push({ title, content })
            await user.save()
        }

        // Gửi thông báo cho tất cả người dùng thông qua socket.io
        io.emit('notification', { title, content })

        responseHandler.ok(res, {
            statusCode: 200,
            message: 'Gửi thông báo thành công!',
        })
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Gửi thông báo không thành công.')
    }
}

const sendMovieUpdateNotification = async (title, content) => {
    try {
        // Lấy danh sách tất cả người dùng
        const users = await userModel.find({})
        if (!users) return responseHandler.badrequest(res, 'Không tìm thấy user nào!')

        // Gửi thông báo cho mỗi người dùng trong danh sách
        for (const user of users) {
            user.notifications.push({ title, content })
            await user.save()
        }

        // Gửi thông báo cho tất cả người dùng thông qua socket.io
        io.emit('notification', { title, content })

        console.log('Gửi thông báo thành công.')
    } catch (error) {
        console.log('Gửi thông báo không thành công:', error)
    }
}

const sendWelcomeNotification = async (userId) => {
    try {
        // Tìm người dùng trong cơ sở dữ liệu bằng userId
        const user = await userModel.findById(userId)

        // Kiểm tra xem người dùng có tồn tại hay không
        if (!user) return responseHandler.badrequest(res, 'Người dùng không tồn tại.')

        // Tạo nội dung thông báo chào mừng
        const title = 'Chào mừng bạn đến với bình nguyên vô tận!'
        const content = 'Xin chào, ' + user.displayName + '! Chúc bạn có trải nghiệm tuyệt vời.'

        // Thêm thông báo vào danh sách thông báo của người dùng
        user.notifications.push({ title, content })

        // Lưu thông tin người dùng đã được cập nhật
        await user.save()

        // Gửi thông báo chào mừng cho người dùng thông qua socket.io
        io.to(userId).emit('notification', { title, content })

        console.log('Gửi thông báo chào mừng thành công.')
    } catch (error) {
        console.log('Gửi thông báo chào mừng không thành công:', error)
    }
}

const deleteWelcomeNotification = async (userId) => {
    try {
        // Tìm người dùng trong cơ sở dữ liệu bằng userId
        const user = await userModel.findById(userId)

        // Kiểm tra xem người dùng có tồn tại hay không
        if (!user) return responseHandler.badrequest(res, 'Người dùng không tồn tại.')

        // Xoá thông báo chào mừng trong danh sách thông báo của người dùng
        user.notifications = user.notifications.filter(
            (notification) => notification.title !== 'Chào mừng bạn đến với bình nguyên vô tận!',
        )

        // Lưu thông tin người dùng đã được cập nhật
        await user.save()

        console.log('Xoá thông báo chào mừng thành công.')
    } catch (error) {
        console.log('Xoá thông báo chào mừng không thành công:', error)
    }
}

const deleteAllNotifications = async (req, res) => {
    try {
        const tokenDecoded = tokenMiddleware.tokenDecode(req)
        const userId = tokenDecoded.infor.id
        // Tìm người dùng trong cơ sở dữ liệu bằng userId
        const user = await userModel.findById(userId)

        // Kiểm tra xem người dùng có tồn tại hay không
        if (!user) return responseHandler.badrequest(res, 'Người dùng không tồn tại.')

        // Xoá tất cả thông báo trong danh sách thông báo của người dùng
        user.notifications = []

        // Lưu thông tin người dùng đã được cập nhật
        await user.save()

        responseHandler.ok(res, {
            statusCode: 200,
            message: 'Xoá tất cả thông báo thành công.',
        })
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Xoá tất cả thông báo không thành công.')
    }
}

const getAllNotifications = async (req, res) => {
    try {
        const tokenDecoded = tokenMiddleware.tokenDecode(req)
        const userId = tokenDecoded.infor.id
        // Tìm người dùng trong cơ sở dữ liệu bằng userId
        const user = await userModel.findById(userId)

        // Kiểm tra xem người dùng có tồn tại hay không
        if (!user) return responseHandler.badrequest(res, 'Người dùng không tồn tại.')

        // Lấy danh sách thông báo của người dùng
        const notifications = user.notifications.sort((a, b) => b.createdAt - a.createdAt)

        responseHandler.ok(res, notifications)
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Lấy tất cả thông báo không thành công')
    }
}

export default {
    setupSocketIO,
    adminPushNotify,
    sendMovieUpdateNotification,
    sendWelcomeNotification,
    deleteWelcomeNotification,
    getAllNotifications,
    deleteAllNotifications,
}
