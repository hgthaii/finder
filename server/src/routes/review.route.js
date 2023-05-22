import express from 'express'
import { body } from 'express-validator'
import reviewController from '../controllers/review.controller.js'
import tokenMiddleware from '../middlewares/token.middleware.js'
import userModel from '../models/user.model.js'
import requestHandler from '../handlers/request.handler.js'

const router = express.Router({ mergeParams: true })

router.get('/', tokenMiddleware.auth, tokenMiddleware.verifyTokenAndRefresh, reviewController.getReviewsOfUser)

router.post(
    '/',
    tokenMiddleware.auth,
    body('mediaId')
        .exists()
        .withMessage('mediaId là bắt buộc!')
        .isLength({ min: 1 })
        .withMessage('mediaId không được trống!'),
    body('content')
        .exists()
        .withMessage('content là bắt buộc!')
        .isLength({ min: 1 })
        .withMessage('content không được trống!'),
    body('mediaType')
        .exists()
        .withMessage('mediaType is required')
        .custom((type) => ['movie', 'tv'].includes(type))
        .withMessage('mediaType invalid'),
    body('mediaTitle').exists().withMessage('mediaTitle is required'),
    body('mediaPoster').exists().withMessage('mediaPoster is required'),
    body('mediaRate').exists().withMessage('mediaRate is required'),
    requestHandler.validate,
    tokenMiddleware.verifyTokenAndRefresh,
    reviewController.create,
)

router.delete('/:reviewId', tokenMiddleware.auth, tokenMiddleware.verifyTokenAndRefresh, reviewController.remove)

export default router
