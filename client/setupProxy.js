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
        '/socket.io',
        createProxyMiddleware({
            target: 'https://api-1p6vh5nm2-hgthaii.vercel.app',
            ws: true,
        }),
    )
}
