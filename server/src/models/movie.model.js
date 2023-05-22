import mongoose from 'mongoose'
import modelOptions from './model.options.js'

export default mongoose.model(
    'Movie',
    mongoose
        .Schema(
            {
                title: {
                    type: String,
                    required: true,
                    unique: true,
                },
                logo: {
                    type: String,
                    required: true,
                },
                duration: {
                    type: String,
                    required: true,
                },
                release_date: {
                    type: String,
                    required: true,
                },
                poster_path: [
                    {
                        path: { type: String },
                    },
                ],
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
                genres: [
                    {
                        name: {
                            type: String,
                            require: true,
                        },
                    },
                ],
                episodes: [
                    {
                        episode_title: {
                            type: String,
                        },
                        episode_runtime: {
                            type: String,
                        },
                        episode_image: {
                            type: String,
                        },
                        episode_description: {
                            type: String,
                        },
                    },
                ],
                casts: [
                    {
                        name: String,
                    },
                ],
                program_type: [
                    {
                        name: String,
                    },
                ],
                age_rating: String,
                creators: [
                    {
                        name: String,
                    },
                ],
                item_genre: String,
                views: {
                    type: Number,
                    default: 0,
                },
            },
            modelOptions,
        )
        .index(
            { title: 'text' },
            {
                language_override: 'vietnamese',
                textIndexVersion: 3,
            },
        ),
)
