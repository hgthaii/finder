import modelOptions from './model.options.js'
import mongoose from 'mongoose'

export default mongoose.model(
    'Cast',
    mongoose.Schema(
        {
            name: {
                type: String,
                require: true,
                unique: true,
            },
        },
        modelOptions,
    ),
)
