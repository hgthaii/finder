import modelOptions from './model.options.js'
import mongoose from 'mongoose'

export default mongoose.model(
    'Comment',
    mongoose.Schema({
        content: {
            type: String,
            require: true,
        },
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
            avatar: {
                data: Buffer,
                contentType: String,
            },
        },
        movieId: {
            type: String,
            require: true,
        },
        level: {
            type: String,
            require: true,
        },
        likes: [
            {
                userId: {
                    type: String,
                    ref: 'User',
                },
                likedIcon: {
                    type: Number,
                    enum: [1100, 1101, 1102, 1103, 1104, 1105], // Danh sách các mã icon đã like
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
                updatedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        replies: [
            {
                content: {
                    type: String,
                    require: true,
                },
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
                    avatar: {
                        data: Buffer,
                        contentType: String,
                    },
                },
                likes: [
                    {
                        userId: {
                            type: String,
                            ref: 'User',
                        },
                        likedIcon: {
                            type: Number,
                            enum: [1100, 1101, 1102, 1103, 1104, 1105], // Danh sách các mã icon đã like
                        },
                    },
                ],
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
                updatedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
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
