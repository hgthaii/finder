import { createProxyMiddleware } from 'http-proxy-middleware'

export default function (app) {
    app.use(
        '/socket.io',
        createProxyMiddleware({
            target: 'http://localhost:5000',
            ws: true,
        }),
    )
    app.use(
        '/api/v1',
        createProxyMiddleware({
            target: 'https://finder-api.onrender.com/',
            ws: true,
        }),
    )
}
