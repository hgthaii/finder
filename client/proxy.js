import { createProxyMiddleware } from 'http-proxy-middleware'
import express from 'express'

const app = express()

app.use(
    '/socket.io',
    createProxyMiddleware({
        target: 'http://localhost:5000',
        ws: true,
    }),
)

app.use(
    '/api',
    createProxyMiddleware({
        target: 'https://www.sandbox.paypal.com',
        changeOrigin: true,
        pathRewrite: {
            '^/api': '', // Xóa tiền tố '/api' khỏi URL yêu cầu
        },
    }),
)