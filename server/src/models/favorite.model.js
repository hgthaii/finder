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
                type: Schema.Types.ObjectId,
                ref: 'Movie',
                require: true,
            },
            title: {
                type: String,
                required: true,
            },
            logo: {
                type: String,
                required: true,
            },
            release_date: {
                type: String,
            },
            poster_path: String,
            overview: {
                type: String,
                required: true,
            },
            trailer: {
                type: String,
            },
            video: {
                type: String,
            },
            age_rating: String,
            item_genre: String,
            createdAt: {
                type: Date,
                default: Date.now,
            },
            updatedAt: {
                type: Date,
                default: Date.now,
            },
        },
        { versionKey: false },
    ),
)
