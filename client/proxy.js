import { createProxyMiddleware } from 'http-proxy-middleware'
import express from 'express'

const app = express()

app.use(
    '/socket.io',
    createProxyMiddleware({
        target: 'https://findermovie.me',
        ws: true,
    }),
)