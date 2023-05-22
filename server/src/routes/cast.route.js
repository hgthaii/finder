import express from 'express'
import { body } from 'express-validator'
import requestHandler from '../handlers/request.handler.js'
import tokenMiddleware from '../middlewares/token.middleware.js'
import castController from '../controllers/cast.controller.js'
import authorizeMiddleware from '../middlewares/authorize.middleware.js'

const router = express.Router()

router.get('/', castController.getAllCasts)
router.get('/:castId', castController.getCastById)
router.get('/:castId/film', castController.getFilmOfCast)

router.post(
    '/',
    body('character')
        .exists()
        .withMessage('character is required')
        .isLength({ min: 1 })
        .withMessage('Độ dài tối thiểu là 1 ký tự'),
    body('profile_path')
        .exists()
        .withMessage('profile_path is required')
        .isLength({ min: 1 })
        .withMessage('Độ dài tối thiểu là 1 ký tự'),
    body('summary')
        .exists()
        .withMessage('summary is required')
        .isLength({ min: 1 })
        .withMessage('Độ dài tối thiểu là 1 ký tự'),
    body('birthYear')
        .exists()
        .withMessage('birthYear is required')
        .isLength({ min: 1 })
        .withMessage('Độ dài tối thiểu là 1 ký tự'),
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    authorizeMiddleware.allowAdminOnly,
    requestHandler.validate,
    castController.addCast,
)

router.delete(
    '/:castId',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    authorizeMiddleware.allowAdminOnly,
    castController.removeCast,
)

export default router
