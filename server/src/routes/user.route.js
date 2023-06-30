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
        .withMessage('Tên người dùng không được trống.')
        .isLength({ min: 4 })
        .withMessage('Tên người dùng phải lớn hơn 4 ký tự'),
    body('password')
        .exists()
        .withMessage('Mật khẩu không được trống.')
        .isLength({ min: 4 })
        .withMessage('Mật khẩu phải dài hơn 4 ký tự.'),
    requestHandler.validate,
    userController.signin,
)

router.post('/signout', userController.signout)

router.put(
    '/update-password',
    tokenMiddleware.auth,
    body('password')
        .exists()
        .withMessage('Mật khẩu không được trống.')
        .isLength({ min: 4 })
        .withMessage('Mật khẩu phải dài hơn 4 ký tự.'),
    body('newPassword')
        .exists()
        .withMessage('Mật khẩu mới không được trống.')
        .isLength({ min: 4 })
        .withMessage('Mật khẩu phải dài hơn 4 ký tự.'),
    body('confirmNewPassword')
        .exists()
        .withMessage('Xác nhận mật khẩu không được trống.')
        .isLength({ min: 4 })
        .withMessage('Xác nhận mật khẩu phải lớn hơn 4 ký tự.')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) throw new Error('Xác nhận mật khẩu không khớp.')
            return true
        }),
    requestHandler.validate,

    userController.updatePassword,
)

router.post('/', tokenMiddleware.auth, userController.findUserByDisplayName)
router.get('/info', tokenMiddleware.auth, userController.getInfo)

router.post(
    '/info/:userId',
    tokenMiddleware.auth,

    authorizeMiddleware.allowAdminOnly,
    userController.getUserById,
)

router.get(
    '/favorites',
    tokenMiddleware.auth,

    favoriteController.getFavoritesOfUser,
)

router.post(
    '/favorites',
    body('movieId')
        .exists()
        .withMessage('ID phim là bắt buộc')
        .isLength({ min: 1 })
        .withMessage('ID phim không được trống.'),
    tokenMiddleware.auth,
    requestHandler.validate,

    favoriteController.addFavorite,
)

router.get(
    '/favorites/:movieId/check',
    tokenMiddleware.auth,

    favoriteController.checkFavorite,
)

router.get(
    '/',
    tokenMiddleware.auth,

    authorizeMiddleware.allowAdminOnly,
    userController.getUserByUsername,
)

router.put(
    '/update-profile',
    body('displayName')
        .exists()
        .withMessage('Tên hiển thị không được trống.')
        .isLength({ min: 4 })
        .withMessage('Tên hiển thị phải lớn hơn 4 ký tự.'),
    tokenMiddleware.auth,

    userController.updateUserByUser,
)

router.put(
    '/info/:userId',
    tokenMiddleware.auth,

    authorizeMiddleware.allowAdminOnly,
    userController.updateUserByAdmin,
)

router.put('/updateUserIsVip', tokenMiddleware.auth, userController.updateUserIsVip)

router.delete(
    '/:userId',
    tokenMiddleware.auth,

    authorizeMiddleware.allowAdminOnly,
    userController.deleteUserById,
)

router.delete(
    '/favorites/del-favorite',
    tokenMiddleware.auth,

    favoriteController.removeFavorite,
)
router.post('/googlelogin', userController.signinWithGoogle)
export default router
