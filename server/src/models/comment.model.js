import modelOptions from './model.options.js'
import mongoose from 'mongoose'

export default mongoose.model(
    'Comment',
    mongoose.Schema(
        {
            content: {
                type: String,
                require: true,
            },
            userId: {
                type: String,
                ref: 'User',
                require: true,
            },
            movieId: {
                type: String,
                require: true,
            },
            level: {
                type: String,
                require: true,
            },
        },
        modelOptions,
    ),
)
