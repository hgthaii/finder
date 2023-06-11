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
        '/socket.io',
        createProxyMiddleware({
            target: 'https://api-hgthaii.vercel.app',
            ws: true,
        }),
    )
    app.use(
        '/socket.io',
        createProxyMiddleware({
            target: 'https://api-flame-gamma.vercel.app',
            ws: true,
        }),
    )
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://api-hgthaii.vercel.app',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/api/v1', // Thay đổi đường dẫn yêu cầu từ /api thành /api/v1
            },
        }),
    )
}
