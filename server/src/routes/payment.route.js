import express from 'express'
import tokenMiddleware from '../middlewares/token.middleware.js'
import config from 'config'
import dateFormat from 'dateformat'
import querystring from 'qs'
import crypto from 'crypto'

const router = express()

router.options('/create_payment_url', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Max-Age', '86400')
    res.sendStatus(200)
})

router.post('/create_payment_url', function (req, res, next) {
    var ipAddr =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress

    var tmnCode = config.get('vnp_TmnCode')
    var secretKey = config.get('vnp_HashSecret')
    var vnpUrl = config.get('vnp_Url')
    var returnUrl = config.get('vnp_ReturnUrl')

    var date = new Date()

    var createDate = dateFormat(date, 'yyyymmddHHmmss')
    var orderId = dateFormat(date, 'HHmmss')
    var amount = 30000
    var bankCode = req.body.bankCode

    var orderInfo = req.body.orderDescription || 'Thai dep trai'
    var orderType = req.body.orderType || 'other'
    var locale = req.body.language
    if (locale === null || locale === '') {
        locale = 'vn'
    }
    var currCode = 'VND'
    var vnp_Params = {}
    vnp_Params['vnp_Version'] = '2.1.0'
    vnp_Params['vnp_Command'] = 'pay'
    vnp_Params['vnp_TmnCode'] = tmnCode
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale
    vnp_Params['vnp_CurrCode'] = currCode
    vnp_Params['vnp_TxnRef'] = orderId
    vnp_Params['vnp_OrderInfo'] = orderInfo
    vnp_Params['vnp_OrderType'] = orderType
    vnp_Params['vnp_Amount'] = amount * 100
    vnp_Params['vnp_ReturnUrl'] = returnUrl
    vnp_Params['vnp_IpAddr'] = ipAddr
    vnp_Params['vnp_CreateDate'] = createDate
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode
    }

    function sortObject(obj) {
        const sorted = {}
        Object.keys(obj)
            .sort()
            .forEach((key) => {
                sorted[key] = obj[key]
            })
        return sorted
    }

    vnp_Params = sortObject(vnp_Params)

    var signData = querystring.stringify(vnp_Params, { encode: false })
    var hmac = crypto.createHmac('sha512', secretKey)
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')
    vnp_Params['vnp_SecureHash'] = signed
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false })

    
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Max-Age', '86400')
    res.redirect(vnpUrl)
})

router.get('/vnpay_ipn', function (req, res, next) {
    var vnp_Params = req.query
    var secureHash = vnp_Params['vnp_SecureHash']

    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']

    vnp_Params = sortObject(vnp_Params)
    var secretKey = config.get('vnp_HashSecret')
    var signData = querystring.stringify(vnp_Params, { encode: false })
    var hmac = crypto.createHmac('sha512', secretKey)
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')

    if (secureHash === signed) {
        var orderId = vnp_Params['vnp_TxnRef']
        var rspCode = vnp_Params['vnp_ResponseCode']
        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
        res.status(200).json({ RspCode: '00', Message: 'success' })
    } else {
        res.status(200).json({ RspCode: '97', Message: 'Fail checksum' })
    }
})

router.get('/vnpay_return', function (req, res, next) {
    var vnp_Params = req.query

    var secureHash = vnp_Params['vnp_SecureHash']

    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']

    vnp_Params = sortObject(vnp_Params)

    var tmnCode = config.get('vnp_TmnCode')
    var secretKey = config.get('vnp_HashSecret')

    var signData = querystring.stringify(vnp_Params, { encode: false })
    var hmac = crypto.createHmac('sha512', secretKey)
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')

    if (secureHash === signed) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

        res.render('success', { code: vnp_Params['vnp_ResponseCode'] })
    } else {
        res.render('success', { code: '97' })
    }
})

export default router
