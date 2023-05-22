import express from 'express'
import { body } from 'express-validator'
import userController from '../controllers/user.controller.js'
import favoriteController from '../controllers/favorite.controller.js'
import requestHandler from '../handlers/request.handler.js'
import userModel from '../models/user.model.js'
import tokenMiddleware from '../middlewares/token.middleware.js'
import authorizeMiddleware from '../middlewares/authorize.middleware.js'
const router = express.Router()

router.post(
    '/signup',
    body('username')
        .exists()
        .withMessage('Tên người dùng là bắt buộc!')
        .isLength({ min: 4 })
        .withMessage('Tài khoản tối thiểu 4 ký tự trở lên!')
        .custom(async (value) => {
            const user = await userModel.findOne({ username: value })
            if (user)
                return Promise.reject({
                    statusCode: 400,
                    message: 'Tài khoản này đã được sử dụng.',
                })
        }),
    body('password')
        .exists()
        .withMessage('Mật khẩu là bắt buộc!')
        .isLength({ min: 4 })
        .withMessage('Mật khẩu tối thiểu từ 4 ký tự'),
    body('confirmPassword')
        .exists()
        .withMessage('Xác nhận mật khẩu là bắt buộc')
        .isLength({ min: 4 })
        .withMessage('Xác nhận mật khẩu từ 4 ký tự trở lên')
        .custom((value, { req }) => {
            if (value !== req.body.password) throw new Error('Xác nhận mật khẩu không đúng, vui lòng thử lại!')
            return true
        }),
    body('displayName')
        .exists()
        .withMessage('Tên hiển thị là bắt buộc')
        .isLength({ min: 2 })
        .withMessage('Tên hiển thị phải từ 2 ký tự trở lên'),
    requestHandler.validate,
    userController.signup,
)

router.post(
    '/signin',
    body('username')
        .exists()
        .withMessage('username is required')
        .isLength({ min: 4 })
        .withMessage('username minimum 4 characters'),
    body('password')
        .exists()
        .withMessage('password is required')
        .isLength({ min: 4 })
        .withMessage('password minimum 4 characters'),
    requestHandler.validate,
    userController.signin,
)

router.post('/signout', tokenMiddleware.auth, userController.signout)

router.put(
    '/update-password',
    tokenMiddleware.auth,
    body('password')
        .exists()
        .withMessage('password is required')
        .isLength({ min: 4 })
        .withMessage('password minimum 4 characters'),
    body('newPassword')
        .exists()
        .withMessage('newPassword is required')
        .isLength({ min: 4 })
        .withMessage('password minimum 4 characters'),
    body('confirmNewPassword')
        .exists()
        .withMessage('confirmNewPassword is required')
        .isLength({ min: 4 })
        .withMessage('confirmNewPassword minimum 4 characters')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) throw new Error('confirmNewPassword not match')
            return true
        }),
    requestHandler.validate,
    tokenMiddleware.verifyTokenAndRefresh,
    userController.updatePassword,
)

router.post('/', tokenMiddleware.auth, tokenMiddleware.verifyTokenAndRefresh, userController.findUserByDisplayName)
router.get('/info', tokenMiddleware.auth, tokenMiddleware.verifyTokenAndRefresh, userController.getInfo)

router.post(
    '/info/:userId',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    authorizeMiddleware.allowAdminOnly,
    userController.getUserById,
)

router.get(
    '/favorites',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    favoriteController.getFavoritesOfUser,
)

router.post(
    '/favorites',
    body('movieId')
        .exists()
        .withMessage('movieId is required')
        .isLength({ min: 1 })
        .withMessage('movieId can not be empty'),
    tokenMiddleware.auth,
    requestHandler.validate,
    tokenMiddleware.verifyTokenAndRefresh,
    favoriteController.addFavorite,
)

router.get(
    '/',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    authorizeMiddleware.allowAdminOnly,
    userController.getUserByUsername,
)

router.put(
    '/update-profile',
    body('displayName')
        .exists()
        .withMessage('displayName is required')
        .isLength({ min: 4 })
        .withMessage('displayName minimum 4 characters'),
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    userController.updateUserByUser,
)

router.put(
    '/info/:userId',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    authorizeMiddleware.allowAdminOnly,
    userController.updateUserByAdmin,
)

router.delete(
    '/:userId',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    authorizeMiddleware.allowAdminOnly,
    userController.deleteUserById,
)

router.delete(
    '/favorites/del-favorite',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    favoriteController.removeFavorite,
)

export default router
