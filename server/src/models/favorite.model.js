import mongoose, { Schema } from 'mongoose'
import modelOptions from './model.options.js'

export default mongoose.model(
    'Favorite',
    mongoose.Schema(
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                require: true,
            },
            movieId: {
                type: String,
                require: true,
            },
            title: {
                type: String,
                // require: true,
            },
            poster_path: {
                type: String,
                // require: true,
            },
            overview: {
                type: String,
                // require: true,
            },
            trailer: {
                type: String,
                // require: true,
            },
        },
        modelOptions,
    ),
)
