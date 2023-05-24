import express from 'express'
import { body } from 'express-validator'
import tokenMiddleware from '../middlewares/token.middleware.js'
import requestHandler from '../handlers/request.handler.js'
import movieController from '../controllers/movie.controller.js'
import authorizeMiddleware from '../middlewares/authorize.middleware.js'
import commentController from '../controllers/comment.controller.js'
import rateLimitMiddleware from '../middlewares/limit.middleware.js'

const router = express.Router()
const windowMs = 60 * 1000 // 1 phút
const maxRequests = 5

router.get('/', movieController.getAllMovies)

router.get('/genre/:genreId', movieController.getMovieByGenre)
router.get('/:movieId', movieController.getMovieById)

router.get('/:movieId/view', movieController.incrementViews)

router.get('/hot-movies/top-movies', movieController.getHotMovies)

router.get('/random/random-movies', movieController.getRandomMovies)

router.get('/:movieId/comments', commentController.getAllCommentOfFilm)

router.post(
    '/comments',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    rateLimitMiddleware(windowMs, maxRequests),
    commentController.createComment,
)

router.put('/comments', tokenMiddleware.verifyTokenAndRefresh, commentController.editComment)

router.delete('/comments/:commentId', tokenMiddleware.verifyTokenAndRefresh, commentController.deleteComment)

router.put(
    '/:movieId',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    authorizeMiddleware.allowAdminOnly,
    movieController.updateMovie,
)

router.post(
    '/',
    body('title')
        .exists()
        .withMessage('title là bắt buộc!')
        .isLength({ min: 1 })
        .withMessage('title không được trống!'),
    body('logo').exists().withMessage('logo is required'),
    body('duration').exists().withMessage('duration is required'),
    body('release_date').exists().withMessage('release_date is required'),
    body('poster_path').exists().withMessage('poster_path is required'),
    body('overview').exists().withMessage('overview is required'),
    body('trailer').exists().withMessage('trailer is required'),
    body('video').exists().withMessage('video is required'),
    body('genres').exists().withMessage('genres is required'),
    body('episodes').exists().withMessage('episodes is required'),
    body('casts').exists().withMessage('casts is required'),
    body('program_type').exists().withMessage('program_type is required'),
    body('age_rating').exists().withMessage('age_rating is required'),
    body('creators').exists().withMessage('creators is required'),
    body('item_genre').exists().withMessage('item_genre is required'),
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    authorizeMiddleware.allowAdminOnly,
    requestHandler.validate,
    movieController.createMovie,
)

router.delete(
    '/:filmId',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    authorizeMiddleware.allowAdminOnly,
    movieController.deleteMovie,
)

export default router
