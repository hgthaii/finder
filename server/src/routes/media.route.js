import express from 'express'
import { body } from 'express-validator'
import mediaController from '../controllers/media.controller.js'
import requestHandler from '../handlers/request.handler.js'
import tokenMiddleware from '../middlewares/token.middleware.js'
import authorizeMiddleware from '../middlewares/authorize.middleware.js'
import transportController from '../controllers/transport.controller.js'

// MergeParams cho phép truyền các tham số của router cha xuống router con
const router = express.Router({ mergeParams: true })

// http://localhost:5000/api/v1/movie/search?q=The%20Godfather&page=1
router.get('/media/search', mediaController.search)

// http://localhost:5000/api/v1/movie/genres
router.get('/', mediaController.getGenres)
router.post(
    '/genres',
    body('name').exists().withMessage('name is required').isLength({ min: 1 }).withMessage('name minimum 1 character'),
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    authorizeMiddleware.allowAdminOnly,
    requestHandler.validate,
    mediaController.addGenres,
)

// Gọi hàm gửi email


router.post('/email', transportController.sendEmail)

export default router
