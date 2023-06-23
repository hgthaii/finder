import express from 'express'
import tokenMiddleware from '../middlewares/token.middleware.js'
import paymentController from '../controllers/payment.controller.js'
import checkAndUpdateVipStatus from '../middlewares/vip.middleware.js'

const router = express()

router.post(
    '/create_payment_url',
    tokenMiddleware.auth,
    paymentController.createPaymentUrl,
)

router.post('/', tokenMiddleware.auth, paymentController.vnpayReturn)

export default router
