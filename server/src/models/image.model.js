import modelOptions from './model.options.js'
import mongoose from 'mongoose'

export default mongoose.model(
    'Image',
    mongoose.Schema({
        user: {
            userId: {
                type: String,
                ref: 'User',
                require: true,
            },
            displayName: {
                type: String,
                require: true,
            },
            username: {
                type: String,
            },
        },
        avatar: {
            data: Buffer,
            contentType: String
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    }),
)
