import jsonwebtoken from 'jsonwebtoken'
import userModel from '../models/user.model.js'
import refreshtokenModel from '../models/refreshtoken.model.js'
import responseHandler from '../handlers/response.handler.js'
import mongoose from 'mongoose'
import tokenMiddleware from '../middlewares/token.middleware.js'
// import cookieMiddleware from '../middlewares/cookie.middleware.js'
import { OAuth2Client } from 'google-auth-library'
import notificationController from './notification.controller.js'

const client = new OAuth2Client('689641141844-dm1eiuln8nqg3rtncacmh64d6mv9skjf.apps.googleusercontent.com')
const signup = async (req, res) => {
    try {
        // Lấy thông tin user mới được gửi lên trong request body
        const { username, password, displayName, roles, email } = req.body

        // Kiểm tra xem user đó đã tồn tại trong database chưa
        const checkUser = await userModel.findOne({ username })

        if (checkUser) return responseHandler.badrequest(res, 'Tài khoản đã tồn tại!')

        const user = new userModel()

        user.displayName = displayName
        user.username = username
        user.email = email
        if (roles) {
            user.roles = roles
        } else {
            user.roles = 'user' // Gán giá trị mặc định nếu trường roles rỗng
        }

        user.setPassword(password)

        await user.save()

        // Create JWT
        const payload = {
            roles: user.roles,
            infor: {
                id: user.id,
                username: user.username,
                displayName: user.displayName,
                email: user.email,
            },
        }

        const token = jsonwebtoken.sign(
            payload,
            process.env.TOKEN_SECRET,
            { expiresIn: '1h' }, // LifeCirle Token
        )

        // const { _id, ...userWithoutId } = user._doc;

        // Thông báo tạo thành công
        responseHandler.created(res, {
            // access_token: token,
            // id: user.id, // Trả về giá trị của _id của user dưới dạng String
            // ...userWithoutId, // Kế thừa props từ _doc. _doc chứa tất cả các key value trừ _id của đối tượng
            statusCode: 201,
            message: 'Đăng ký tài khoản thành công',
        })
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Đăng ký không thành công!')
    }
}

const signin = async (req, res) => {
    try {
        const { username, password } = req.body
        // Chỉ định các trường cần được trả về, bao gồm cả trường roles
        const user = await userModel
            .findOne({ username })
            .select('username id salt password displayName roles createdAt updatedAt isVip vipExpirationDate email')
        if (!user) return responseHandler.badrequest(res, 'Tài khoản không tồn tại!')

        if (!user.validPassword(password)) return responseHandler.badrequest(res, 'Sai mật khẩu, vui lòng thử lại!')

        const payload = {
            roles: user.roles,
            infor: {
                id: user.id,
                displayName: user.displayName,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                isVip: user.isVip,
                vipExpirationDate: user.vipExpirationDate,
            },
        }

        const accessToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
            expiresIn: '24h',
        })

        const refreshToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
            expiresIn: '72h',
        })
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            // domain: 'api-41z0.onrender.com',
            // secure: true,
            sameSite: 'none',
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
            // domain: 'api-41z0.onrender.com',
            sameSite: 'none',
        })
        const refreshTokenDoc = new refreshtokenModel({
            token: refreshToken,
            expiryDate: 72 * 60 * 60 * 1000,
            user: user.id,
        })
        // console.log(refreshTokenDoc)
        await refreshTokenDoc.save()

        // Gỡ pass và hash ra khỏi response
        user.password = undefined
        user.salt = undefined

        // Gắn đối tượng user đã xác thực vào req object
        req.user = user
        await notificationController.sendWelcomeNotification(user.id)

        responseHandler.created(res, {
            access_token: accessToken,
            refresh_token: refreshToken,
        })
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Đăng nhập không thành công')
    }
}

const signout = async (req, res) => {
    try {
        const refreshToken =
            req.headers['cookie']?.split(';')[3]?.split('=')[1] || req.headers['authorization']?.split(' ')[1]
        const tokenDecoded = tokenMiddleware.tokenDecode(req)
        const userId = tokenDecoded.infor.id
        if (!refreshToken) return responseHandler.badrequest(res, 'Không có refreshToken')
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        await refreshtokenModel.findOneAndDelete({ token: refreshToken })
        await notificationController.deleteWelcomeNotification(userId)
        responseHandler.ok(res, {
            statusCode: 200,
            message: 'Đăng xuất thành công!',
        })
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Đăng xuất không thành công!')
    }
}

const updatePassword = async (req, res) => {
    try {
        // Lấy data từ req
        const { password, newPassword } = req.body

        const userId = tokenMiddleware.tokenDecode(req).infor.id

        // Tìm user và lấy các trường được select
        const user = await userModel.findById(userId).select('password id salt')

        if (!user) return responseHandler.unauthorize(res)

        if (!user.validPassword(password)) return responseHandler.badrequest(res, 'Sai mật khẩu, vui lòng thử lại!')

        // Đặt lại password mới cho user
        user.setPassword(newPassword)
        await user.save()

        responseHandler.ok(res, {
            statusCode: 200,
            message: 'Đổi mật khẩu thành công!',
        })
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Đổi mật khẩu không thành công!')
    }
}

// Lấy danh sách thông tin user
const getInfo = async (req, res) => {
    try {
        const user = await userModel.find({ roles: 'user' })
        if (!user) return responseHandler.notfound(res)
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')

        responseHandler.ok(res, user)
    } catch {
        responseHandler.error(res, 'Lấy danh sách user không thành công')
    }
}

// Tìm user theo ID
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return responseHandler.error(res, 'userId không phải ObjectId')
        }
        const user = await userModel.findById(userId)
        if (!user) {
            return responseHandler.notfound(res, {
                statusCode: 404,
                message: 'Không tìm thấy thông tin người dùng.',
            })
        }
        responseHandler.ok(res, user)
    } catch {
        responseHandler.error(res, `Tìm user không thành công!`)
    }
}

const updateUserByUser = async (req, res) => {
    try {
        const { displayName } = req.body
        const tokenDecoded = tokenMiddleware.tokenDecode(req)
        const checkId = tokenDecoded.infor.id
        if (!checkId) return responseHandler.notfound(res, 'Không tìm thấy id')

        const user = await userModel.findById(checkId).select('username id displayName')
        if (!user) {
            return responseHandler.notfound(res, 'User không tồn tại!')
        }

        user.displayName = displayName || user.displayName
        await user.save()

        responseHandler.ok(res, {
            statusCode: 200,
            message: `Cập nhật user ${user.username} thành công!`,
            new_update: user,
        })
    } catch {
        responseHandler.error(res, 'Update user không thành công!')
    }
}

const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.query
        const checkUserName = await userModel.findOne({ username }).select('username id displayName roles createdAt')
        if (!checkUserName) return responseHandler.notfound(res, 'Không tìm thấy username')
        responseHandler.ok(res, checkUserName)
    } catch {
        responseHandler.error(res, 'Tìm username thất bại')
    }
}

const findUserByDisplayName = async (req, res) => {
    try {
        const { displayName } = req.body
        const checkName = await userModel
            .find({ displayName: { $regex: displayName }, roles: 'user' })
            .select('displayName username roles createdAt')
        if (checkName.length > 0) {
            responseHandler.ok(res, checkName)
        } else {
            responseHandler.ok(res, displayName)
        }
    } catch (error) {
        responseHandler.error(res, 'Tìm user theo tên hiển thị không thành công!')
    }
}

const updateUserByAdmin = async (req, res) => {
    try {
        const { userId } = req.params
        const { displayName, password, roles } = req.body

        // Kiểm tra tính hợp lệ của userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return responseHandler.error(res, 'userId không phải ObjectId')
        }

        // Cập nhật thông tin người dùng
        const updateData = { displayName, roles }
        if (password) {
            const user = await userModel.findById(userId)
            if (!user) {
                return responseHandler.notfound(res, 'User không tồn tại!')
            }
            user.setPassword(password)
            await user.save()
            updateData.password = user.password
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true })
        if (!updatedUser) {
            return responseHandler.notfound(res, 'User không tồn tại!')
        }

        responseHandler.ok(res, {
            statusCode: 200,
            message: `Cập nhật user ${updatedUser.username} thành công!`,
            new_update: updatedUser,
        })
    } catch (error) {
        console.error(error)
        responseHandler.error(res, 'Update user không thành công!')
    }
}

const deleteUserById = async (req, res) => {
    try {
        const userId = req.params.userId.split(',')

        const deletedUsers = await userModel.deleteMany({
            _id: { $in: userId },
        })
        if (deletedUsers.deletedCount === 0)
            return responseHandler.notfound(res, `Không tìm thấy user có ID trong danh sách`)

        responseHandler.ok(res, {
            statusCode: 200,
            message: `Xoá thành công ${deletedUsers.deletedCount} user!`,
            data: deletedUsers,
        })
    } catch (error) {
        responseHandler.error(res, 'Xoá user không thành công!')
    }
}

const updateUserIsVip = async (req, res) => {
    try {
        const { isVip } = req.body
        const userId = tokenMiddleware.tokenDecode(req).infor.id
        if (!userId) return responseHandler.badrequest(res)

        const user = await userModel.findOneAndUpdate({ userId }, { isVip: true }, { new: true })
        if (!user) return responseHandler.badrequest(res, 'Không tìm thấy user')

        responseHandler.ok(res, user)
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 'Nâng cấp gói Vip không thành công.')
    }
}

const signinWithGoogle = async (req, res) => {
    const { tokenId } = req.body

    try {
        const response = await client.verifyIdToken({
            idToken: tokenId,
            audience: '689641141844-dm1eiuln8nqg3rtncacmh64d6mv9skjf.apps.googleusercontent.com',
        })

        const { email_verified, name, email } = response.payload

        if (!email_verified) {
            return responseHandler.badrequest(res, 'Email chưa được xác minh')
        }

        let user = await userModel.findOne({ email })

        if (user) {
            handleExistingUser(req, res, user)
        } else {
            handleNewUser(req, res, email, name)
        }
    } catch (error) {
        console.error(error)
        responseHandler.badrequest(res, 'Đã có lỗi xảy ra, vui lòng thử lại sau')
    }
}

const handleExistingUser = async (req, res, user) => {
    // Gỡ pass và hash ra khỏi user object
    const { password, salt, ...userWithoutPassword } = user.toObject()

    // Gắn đối tượng user đã xác thực vào req object
    req.user = userWithoutPassword

    const payload = {
        roles: user.roles,
        infor: {
            id: user.id,
            email: user.email,
            isVip: user.isVip,
            displayName: user.displayName,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
    }

    const accessToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: '2h',
    })

    const refreshToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: '24h',
    })

    const refreshTokenDoc = new refreshtokenModel({
        token: refreshToken,
        expiryDate: 24 * 60 * 60 * 1000,
        user: user.id,
    })

    await refreshTokenDoc.save()

    responseHandler.ok(res, {
        access_token: accessToken,
        refresh_token: refreshToken,
        displayName: user.displayName,
        userId: user.id,
    })
}

const handleNewUser = async (req, res, email, name) => {
    // Check if username already exists
    const existingUser = await userModel.findOne({ username: email })

    if (existingUser) {
        handleExistingUser(req, res, existingUser)
    } else {
        const newPassword = process.env.TOKEN_SECRET

        const newUser = new userModel({
            email: email,
            username: email,
            displayName: name,
            password: newPassword,
            salt: email + process.env.TOKEN_SECRET,
        })

        await newUser.save()

        // Gỡ pass và hash ra khỏi user object
        const { password, salt, ...newUserWithoutPassword } = newUser.toObject()

        // Gắn đối tượng user đã xác thực vào req object
        req.user = newUserWithoutPassword

        const payload = {
            roles: newUser.roles,
            infor: {
                id: newUser.id,
                isVip: newUser.isVip,
                displayName: newUser.displayName,
                email: newUser.email,
                username: newUser.username,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
            },
        }

        const accessToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
            expiresIn: '2h',
        })

        const refreshToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
            expiresIn: '24h',
        })

        const refreshTokenDoc = new refreshtokenModel({
            token: refreshToken,
            expiryDate: 24 * 60 * 60 * 1000,
            user: newUser.id,
        })

        await refreshTokenDoc.save()

        responseHandler.created(res, {
            access_token: accessToken,
            refresh_token: refreshToken,
            displayName: newUser.displayName,
            userId: newUser.id,
        })
    }
}

export default {
    signup,
    signin,
    signout,
    getInfo,
    getUserById,
    getUserByUsername,
    updatePassword,
    updateUserByUser,
    updateUserByAdmin,
    findUserByDisplayName,
    deleteUserById,
    updateUserIsVip,
    signinWithGoogle,
}
