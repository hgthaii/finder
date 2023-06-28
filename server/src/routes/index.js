import express from 'express'
import userRoute from './user.route.js'
import mediaRoute from './media.route.js'
// import personRoute from './person.route.js'
import reviewRoute from './review.route.js'
import movieRoute from './movie.route.js'
import tokenRoute from './token.route.js'
import castRoute from './cast.route.js'
import paymentRoute from './payment.route.js'
import notificationRoute from './notification.route.js'

const router = express.Router()

router.use('/payment', paymentRoute)
router.use('/user', userRoute)
router.use('/movies', movieRoute)
router.use('/reviews', reviewRoute)
router.use('/genres', mediaRoute)
router.use('/auth', tokenRoute)
router.use('/casts', castRoute)
router.use('/notifications', notificationRoute)

export default router
