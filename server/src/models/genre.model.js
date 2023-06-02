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
            timestamps: false,
            versionKey: false,
        },
    ),
)
