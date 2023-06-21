import express, { response } from 'express'
import tokenMiddleware from '../middlewares/token.middleware.js'
import config from 'config'
import 'dotenv/config'
import responseHandler from '../handlers/response.handler.js'
import paypal from 'paypal-rest-sdk'
import { createProxyMiddleware } from 'http-proxy-middleware'

const router = express()
const app = express()

paypal.configure({
    mode: 'sandbox', //sandbox or live
    client_id: 'AYNX0lNwdcCXDV3tL6toOPfCMK8kJZukh6T1LOV7pKCQQOmcjmMt_7ZLvjSC8g8Ilygpp0XHw76pXEPH',
    client_secret: 'EEIbzHXn2etakwXatqawZ99JegX7nSinfeIzVvI5oL6aElhfa2uvfDP5jhnTyJ-Ga1PUm2AjWcON-2Y-',
})

app.use(
    '/api',
    createProxyMiddleware({
        target: 'http://localhost:5000',
        changeOrigin: true,
    }),
)


router.post('/pay', (req, res) => {
    var create_payment_json = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal',
        },
        redirect_urls: {
            return_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/failed',
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: 'item',
                            sku: 'item',
                            price: '1.00',
                            currency: 'USD',
                            quantity: 1,
                        },
                    ],
                },
                amount: {
                    currency: 'USD',
                    total: '1.00',
                },
                description: 'This is the payment description.',
            },
        ],
    }

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error
        } else {
            for (let i = 0;i < payment.links.length;i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href)
                }
            }
        }
    })
})

router.get('/config', (req, res) => {
    return responseHandler.ok(res, {
        statusCode: 200,
        data: process.env.PAYPAL_ID
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

export default router
