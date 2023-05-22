import jsonwebtoken from 'jsonwebtoken'
import userModel from '../models/user.model.js'
import refreshtokenModel from '../models/refreshtoken.model.js'
import responseHandler from '../handlers/response.handler.js'
import mongoose from 'mongoose'
import tokenMiddleware from '../middlewares/token.middleware.js'

const signup = async (req, res) => {
    try {
        // Lấy thông tin user mới được gửi lên trong request body
        const { username, password, displayName, roles } = req.body

        // Kiểm tra xem user đó đã tồn tại trong database chưa
        const checkUser = await userModel.findOne({ username })

        if (checkUser) return responseHandler.badrequest(res, 'Tài khoản đã tồn tại!')

        const user = new userModel()

        user.displayName = displayName
        user.username = username
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
                displayName: user.displayName,
                username: user.username,
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
            access_token: token,
            // id: user.id, // Trả về giá trị của _id của user dưới dạng String
            // ...userWithoutId, // Kế thừa props từ _doc. _doc chứa tất cả các key value trừ _id của đối tượng
        })
    } catch (error) {
        responseHandler.error(res, 'Đăng ký không thành công!')
        console.log(error)
    }
}

const signin = async (req, res) => {
    try {
        const { username, password } = req.body

        // Chỉ định các trường cần được trả về, bao gồm cả trường roles
        const user = await userModel
            .findOne({ username })
            .select('username password salt id displayName roles createdAt updatedAt')
        if (!user) return responseHandler.badrequest(res, 'User không tồn tại!')

        if (!user.validPassword(password)) return responseHandler.badrequest(res, 'Sai mật khẩu, vui lòng thử lại!')

        const payload = {
            roles: user.roles,
            infor: {
                id: user.id,
                displayName: user.displayName,
                username: user.username,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        }

        const accessToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
            expiresIn: '1h',
        })

        const refreshToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
            expiresIn: '3h',
        })
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 1 * 60 * 60 * 1000,
            domain: 'localhost',
            // path: '/api/v1',
            // secure: true,
            // sameSite: true
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 3 * 60 * 60 * 1000,
            domain: 'localhost',
            // path: '/api/v1',
            // secure: true,
            // sameSite: true,
        })
        const refreshTokenDoc = new refreshtokenModel({
            token: refreshToken,
            expiryDate: 3 * 60 * 60 * 1000,
            user: user.id,
        })
        // console.log(refreshTokenDoc)
        await refreshTokenDoc.save()

        // Gỡ pass và hash ra khỏi response
        user.password = undefined
        user.salt = undefined

        // Gắn đối tượng user đã xác thực vào req object
        req.user = user

        // const { _id, ...userWithoutId } = user._doc;

        responseHandler.created(res, {
            access_token: accessToken,
            refresh_token: refreshToken,
        })
    } catch (error) {
        console.log(error);
        responseHandler.error(res, 'Đăng nhập không thành công')
    }
}

const signout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies
        if (!refreshToken) return responseHandler.badrequest(res, 'Không có refreshToken')
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        await refreshtokenModel.findOneAndDelete({ token: refreshToken })
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

        // Tìm user và lấy các trường được select
        const user = await userModel.findById(req.user.id).select('password id salt')

        if (!user) return responseHandler.unauthorize(res)

        if (!user.validPassword(password)) return responseHandler.badrequest(res, 'Sai mật khẩu, vui lòng thử lại!')

        // Đặt lại password mới cho user
        user.setPassword(newPassword)
        await user.save()

        responseHandler.ok(res, {
            statusCode: 200,
            message: 'Đổi mật khẩu thành công!',
        })
    } catch {
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
}
