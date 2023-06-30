import express from 'express'
import { body } from 'express-validator'
import mediaController from '../controllers/media.controller.js'
import requestHandler from '../handlers/request.handler.js'
import tokenMiddleware from '../middlewares/token.middleware.js'
import authorizeMiddleware from '../middlewares/authorize.middleware.js'

// MergeParams cho phép truyền các tham số của router cha xuống router con
const router = express.Router({ mergeParams: true })

router.get('/media/search', mediaController.search)
router.get('/', mediaController.getGenres)

router.get(
    '/find-genre',
    tokenMiddleware.auth,
    mediaController.findGenre
)

router.post(
    '/',
    body('name')
        .exists()
        .withMessage('Tên thể loại không được trống!')
        .isLength({ min: 2 })
        .withMessage('Tên thể loại phải lớn hơn 2 ký tự.'),
    tokenMiddleware.auth,

    authorizeMiddleware.allowAdminOnly,
    requestHandler.validate,
    mediaController.addGenres,
)

router.put(
    '/update/:genreId',
    body('name').exists().withMessage('Tên thể loại không được trống!').isLength({min: 2}).withMessage('Tên thể loại phải lớn hơn 2 ký tự.'),
    tokenMiddleware.auth,
    authorizeMiddleware.allowAdminOnly,
    requestHandler.validate,
    mediaController.updateGenre,
)

router.delete(
    '/delete/:genreId',
    tokenMiddleware.auth,
    authorizeMiddleware.allowAdminOnly,
    mediaController.deleteGenre
)

export default router
