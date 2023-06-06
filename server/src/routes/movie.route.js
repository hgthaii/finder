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

router.get('/genre/:genreId', movieController.getAllMovieByGenre)
router.get('/:movieId', movieController.getMovieById)
router.get('/media/search', movieController.searchMovieByGenre)

router.get('/:movieId/view', movieController.incrementViews)

router.get('/hot-movies/top-movies', movieController.getHotMovies)

router.get('/random/random-movies', movieController.getRandomMovies)

router.get('/:movieId/comments', commentController.getAllCommentOfFilm)
router.get('/comments/:userId', commentController.getAllCommentOfUser)

router.post(
    '/comments',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    rateLimitMiddleware(windowMs, maxRequests),
    commentController.createComment,
)

router.put(
    '/comments/:commentId/like',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    commentController.likeComment,
)

router.put(
    '/comments/:commentId/like/reply',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    commentController.likeReplyComment,
)

router.put(
    '/comments/:commentId/unlike',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    commentController.unlikeComment,
)

router.put(
    '/comments/:commentId/unlike/reply',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    commentController.unlikeReplyComment,
)

router.put(
    '/comments/:commentId/change-liked',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    commentController.changeLikedIcon,
)

router.put(
    '/comments/:commentId/change-liked/reply',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    commentController.changeLikedReplyIcon,
)

router.post(
    '/comments/:commentId/reply',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    commentController.replyToComment,
)

router.put(
    '/comments/:commentId/edit',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    commentController.editComment,
)

router.put(
    '/comments/:commentId/edit/reply',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    commentController.editReplyComment,
)

router.delete(
    '/comments/:commentId/delete',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    commentController.deleteComment,
)

router.delete(
    '/comments/:commentId/delete/:replyId/reply',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    commentController.deleteReplyComment,
)

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
    // body('creators').exists().withMessage('creators is required'),
    body('item_genre').exists().withMessage('item_genre is required'),
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    authorizeMiddleware.allowAdminOnly,
    requestHandler.validate,
    movieController.createMovie,
)

router.get('/:movieId/episodes', movieController.episodeList)

router.delete(
    '/:filmId',
    tokenMiddleware.auth,
    tokenMiddleware.verifyTokenAndRefresh,
    authorizeMiddleware.allowAdminOnly,
    movieController.deleteMovie,
)

export default router
