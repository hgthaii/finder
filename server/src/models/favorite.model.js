import mongoose, { Schema } from 'mongoose'
import modelOptions from './model.options.js'

export default mongoose.model(
    'Favorite',
    mongoose.Schema({
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
            required: true,
            unique: true,
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
        createdAt: {
            type: Date,
            default: Date.now,
        },
        age_rating: String,
        item_genre: String,
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    }, {versionKey: false,}),
)
