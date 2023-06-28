import express from 'express'
import tokenMiddleware from '../middlewares/token.middleware.js'
import paymentController from '../controllers/payment.controller.js'
import checkAndUpdateVipStatus from '../middlewares/vip.middleware.js'
import transportController from '../controllers/transport.controller.js'

const router = express()

router.post('/create_payment_url', tokenMiddleware.auth, paymentController.createPaymentUrl)

router.post('/', paymentController.vnpayReturn)

router.post('/send-email', transportController.sendPaymentSuccessEmail)

export default router
