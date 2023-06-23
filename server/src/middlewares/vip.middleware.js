import userModel from '../models/user.model.js'

const checkAndUpdateVipStatus = async () => {
    const currentDate = new Date()
    try {
        const expiredUsers = await userModel.find({ isVip: true, vipExpirationDate: { $lt: currentDate } })
        if (expiredUsers.length > 0) {
            await userModel.updateMany(
                { _id: { $in: expiredUsers.map((user) => user._id) } },
                { $set: { isVip: false } },
            )
        }
        console.log('expiredUsers: ', expiredUsers)
    } catch (error) {
        console.error('Failed to check and update VIP status:', error)
    }
}

setInterval(checkAndUpdateVipStatus, 24 * 60 * 60 * 1000)

export default checkAndUpdateVipStatus