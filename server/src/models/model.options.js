const modelOptions = {
    // toJSON định nghĩa cách thức chuyển đổi đối tượng Mongoose sang JSON
    toJSON: {
        virtuals: true, // Cho phép sử dụng các virtual properties
        // Hàm transform được áp dụng lên Mongoose trước khi change thành JSON và xóa trường _id khỏi object
        transform: (_, obj) => {
            delete obj._id
            return obj
        },
    },
    // toObject chuyển đổi object Mongoose sang object thường
    toObject: {
        virtuals: true,
        transform: (_, obj) => {
            delete obj._id
            return obj
        },
    },
    versionKey: false, // Loại trường __v khỏi object
    timestamps: true, // Automate 'createdAt' và 'updateAt' vào object
}

export default modelOptions
