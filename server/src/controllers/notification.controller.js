import responseHandler from '../handlers/response.handler';
import { EventEmitter } from 'events'

const eventEmitter = new EventEmitter()

const notify = async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*')

    // Gửi thông báo cho người dùng khi có sự kiện
    const sendNotification = (message) => {
        res.write(`data: ${JSON.stringify(message)}\n\n`)
    }

    // Nghe sự kiện từ admin
    eventEmitter.on('notification', sendNotification)

    // Đóng kết nối khi người dùng ngắt kết nối
    res.on('close', () => {
        eventEmitter.off('notification', sendNotification)
    })
}

const adminPushNotify = (req, res) => {
    try {
        const message = { text: 'Thông báo mới từ admin' }

        // Gửi thông báo tới tất cả người dùng đang kết nối
        eventEmitter.emit('notification', message)

        responseHandler.ok(res, 'Thông báo thành công.')
    } catch (error) {
        console.log(error);
        responseHandler.error(res, 'Thông báo không thành công.')
    }
}


export default { notify, adminPushNotify }