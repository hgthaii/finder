import tokenMiddleware from './token.middleware.js'
import userModel from '../models/user.model.js'
import responseHandler from '../handlers/response.handler.js'

const allowAdminOnly = async (req, res, next) => {
    const tokenDecoded = tokenMiddleware.tokenDecode(req)
    const user = await userModel.findById(tokenDecoded.infor.id)
    if (!user) {
        return responseHandler.unauthorize(res, 'Không tìm thấy người dùng')
    }
    const role = user.roles
    if (role === 'admin') {
        next()
    } else if (role === 'user') {
        return responseHandler.unauthorize(res, 'Bạn không có quyền dùng chức năng này!')
    }
}

export default { allowAdminOnly }
