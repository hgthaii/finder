import express from 'express'
import tokenMiddleware from '../middlewares/token.middleware.js'
import requestHandler from '../handlers/request.handler.js'
import authorizeMiddleware from '../middlewares/authorize.middleware.js'

const router = express.Router()

router.post('/token', requestHandler.validate, authorizeMiddleware.allowAdminOnly, tokenMiddleware.tokenGlobal)

export default router
