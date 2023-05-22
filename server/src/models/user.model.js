import mongoose from 'mongoose'
import modelOptions from './model.options.js'
import crypto from 'crypto'

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true, // Duy nhất
        },
        displayName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            select: false, // Không được lấy ra khi query
        },
        roles: { type: String, enum: ['user'], default: 'user' },
        salt: {
            type: String,
            required: true,
            select: false,
        },
        favorites: [
            {
                movieId: String,
                title: String,
                poster_path: String,
                overview: String,
                trailer: String,
            },
        ],
    },
    modelOptions,
)

userSchema.methods.setPassword = function (password) {
    // Tạo một chuỗi ngẫu nhiên
    this.salt = crypto.randomBytes(16).toString('hex')

    // Băm mật khẩu
    this.password = crypto
        .pbkdf2Sync(
            password, // Mật khẩu người dùng
            this.salt,
            1000, // Số lần lặp
            64, // Độ dài kết quả băm
            'sha512', // Thuật toán để băm
        )
        .toString('hex')
}

// Kiểm tra mật khẩu đã nhập có match với DB
userSchema.methods.validPassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')

    return this.password === hash
}

const userModel = mongoose.model('User', userSchema)

export default userModel
