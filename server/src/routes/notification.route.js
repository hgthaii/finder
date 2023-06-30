import express from 'express'
import notificationController from '../controllers/notification.controller.js'
import tokenMiddleware from '../middlewares/token.middleware.js'
import authorizeMiddleware from '../middlewares/authorize.middleware.js'
import { body } from 'express-validator'

const router = express()

router.get('/', tokenMiddleware.auth, notificationController.getAllNotifications)

router.post(
    '/push',
    body('title').exists().withMessage('Tiêu đề không được trống!').isLength({ min: 2 }).withMessage('Độ dài tiêu đề phải lớn hơn 2 ký tự.'),
    body('content').exists().withMessage('Nội dung không được trống.').isLength({ max: 150 }).withMessage('Độ dài nội dung không vượt quá 150 ký tự.'),
    tokenMiddleware.auth,
    authorizeMiddleware.allowAdminOnly,
    notificationController.adminPushNotify)

router.delete('/delete-all-notify', tokenMiddleware.auth, notificationController.deleteAllNotifications)

export default router
