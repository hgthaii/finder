import express from 'express'
import tokenMiddleware from '../middlewares/token.middleware.js'
import config from 'config'
import dateFormat from 'dateformat'
import querystring from 'qs'
import crypto from 'crypto'

const router = express()

router.post('/', function (req, res, next) {
    const vnpayPaymentUrl = 'https://vnpay-gpw7.onrender.com/order/create_payment_url'
    res.redirect(vnpayPaymentUrl)
    next()
})

export default router
