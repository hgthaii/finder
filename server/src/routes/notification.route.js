import express from 'express'
import notificationController from '../controllers/notification.controller.js'
import tokenMiddleware from '../middlewares/token.middleware.js'
import authorizeMiddleware from '../middlewares/authorize.middleware.js'

const router = express()

router.post('/push', tokenMiddleware.auth, authorizeMiddleware.allowAdminOnly, notificationController.adminPushNotify)

export default router