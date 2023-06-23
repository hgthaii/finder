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
    '/socket.io',
    createProxyMiddleware({
        target: 'https://finder-api-hgthaii.vercel.app',
        ws: true,
    }),
)