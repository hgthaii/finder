import mongoose from 'mongoose'

export default mongoose.model(
    'Genre',
    mongoose.Schema(
        {
            name: {
                type: String,
                unique: true,
                require: true,
            },
        },
        {
            toJSON: {
                virtuals: true,
                transform: (_, obj) => {
                    delete obj._id
                    return obj
                },
            },
            toObject: {
                virtuals: true,
                transform: (_, obj) => {
                    delete obj._id
                    return obj
                },
            },
            timestamps: false,
            versionKey: false,
        },
    ),
)
