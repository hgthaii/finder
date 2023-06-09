import responseHandler from '../handlers/response.handler.js'
import refreshtokenModel from '../models/refreshtoken.model.js'
import userModel from '../models/user.model.js'
import jsonwebtoken from 'jsonwebtoken'

const tokenDecode = (req) => {
    try {
        // const accessToken = req.headers.cookie.split(';')[0].split('=')[1]
        const accessToken = req.headers['authorization']
        if (accessToken) {
            const token = accessToken.split(' ')[1]
            return jsonwebtoken.verify(token, process.env.TOKEN_SECRET)
        }
        return false
    } catch (error) {
        return false
    }
}

const auth = async (req, res, next) => {
    const tokenDecoded = tokenDecode(req)
    if (!tokenDecoded) return responseHandler.unauthorize(res, 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!')
    const user = await userModel.findById(tokenDecoded.infor.id)
    if (!user) return responseHandler.unauthorize(res, 'Không tìm thấy user')
    req.user = user
    next()
}

const isRefreshTokenExpired = (refreshToken) => {
    if (!refreshToken) return true
    const decoded = tokenDecode(refreshToken)
    const expiryDate = new Date(decoded.exp * 1000) // Chuyển đổi từ timestamp thành đối tượng Date

    // So sánh thời gian hiện tại với thời gian hết hạn của refresh token
    return new Date() > expiryDate
}

const verifyTokenAndRefresh = async (req, res, next) => {
    const refreshToken = req.headers['authorization'].split(' ')[1].split('.')[1]
    const accessToken = req.headers['authorization'].split(' ')[1].split('.')[1]
    try {
        // Kiểm tra tính hợp lệ của access token
        const decoded = jsonwebtoken.verify(accessToken, process.env.TOKEN_SECRET)
        // Thêm thông tin người dùng vào đối tượng yêu cầu
        req.user = decoded.user
        // Tiếp tục xử lý yêu cầu
        next()
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            if (isRefreshTokenExpired(refreshToken)) {
                // Xóa refresh token khỏi cơ sở dữ liệu
                await refreshtokenModel.findOneAndDelete({ token: refreshToken })
                // Xóa cookie refresh token từ client
                res.clearCookie('refreshToken')
                return responseHandler.unauthorize(
                    res,
                    'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại! refreshtoken',
                )
            }

            // if (!refreshToken) return responseHandler.unauthorize(res, 'Token không hợp lệ!')
            try {
                // Kiểm tra tính hợp lệ của refresh token
                const refreshTokenDoc = await refreshtokenModel.findOne({ token: refreshToken }).select('user token')
                if (!refreshTokenDoc) {
                    responseHandler.unauthorize(res, 'Refresh token không hợp lệ')
                }

                const user = await userModel
                    .findById(refreshTokenDoc.user)
                    .select('username id displayName roles createdAt updatedAt')
                if (!user) return responseHandler.badrequest(res, 'Token không hợp lệ!')

                // Gỡ pass và hash ra khỏi response
                user.password = undefined
                user.salt = undefined

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

                const newAccessToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
                    expiresIn: '24h',
                })

                res.cookie('accessToken', newAccessToken, {
                    // httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                    domain: 'finder-api-hgthaii.vercel.app',
                    // path: '/api/v1',
                    // secure: true,
                    // sameSite: true,
                })

                req.user = user

                next()
            } catch (error) {
                console.log(error)
                responseHandler.unauthorize(res, 'Token không hợp lệ.')
            }
        } else {
            console.log(error)
            responseHandler.unauthorize(res, 'Token không hợp lệ!')
        }
    }
}

const tokenGlobal = async (req, res) => {
    try {
        const { username, password, client_id, client_secret } = req.body

        // Chỉ định các trường cần được trả về
        const user = await userModel.findOne({ username }).select('username password salt id')

        if (!user) return responseHandler.badrequest(res, 'Tài khoản không tồn tại!')

        if (!user.validPassword(password)) return responseHandler.badrequest(res, 'Sai mật khẩu, vui lòng thử lại!')

        // Tạo token global truy cập, hạn 1h
        if (client_id === process.env.CLIENT_ID && client_secret === process.env.CLIENT_SECRET) {
            var token = jsonwebtoken.sign({ data: user.id }, process.env.TOKEN_SECRET, { expiresIn: '1h' })
        }

        // Gỡ pass và hash ra khỏi response
        user.password = undefined
        user.salt = undefined

        req.user = user

        responseHandler.ok(res, {
            access_token: token,
            token_type: 'bearer',
            expiry: 'Hạn sử dụng 1h.',
            username,
            client_id,
            client_secret,
        })
    } catch {
        responseHandler.error(res, 'Lỗi token')
    }
}

export default { auth, tokenDecode, tokenGlobal, verifyTokenAndRefresh }
