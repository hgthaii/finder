import mongoose, { Schema } from 'mongoose'
import modelOptions from './model.options.js'

export default mongoose.model(
    'RefreshToken',
    mongoose.Schema(
        {
            token: { type: String, require: true },
            expiryDate: { type: Date, require: true },
            user: { type: String, ref: 'User', require: true },
        },
        modelOptions,
    ),
)
