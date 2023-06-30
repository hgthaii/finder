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

    rateLimitMiddleware(windowMs, maxRequests),
    commentController.createComment,
)

router.get('/comments/:commentId/like-count', commentController.getLikesComment)
router.get('/comments/:commentId/like-count/reply', commentController.GetLikesReplyComment)

router.put(
    '/comments/:commentId/like',
    tokenMiddleware.auth,

    commentController.likeComment,
)

router.put(
    '/comments/:commentId/like/reply',
    tokenMiddleware.auth,

    commentController.likeReplyComment,
)

router.put(
    '/comments/:commentId/unlike',
    tokenMiddleware.auth,

    commentController.unlikeComment,
)

router.put(
    '/comments/:commentId/unlike/reply',
    tokenMiddleware.auth,

    commentController.unlikeReplyComment,
)

router.put(
    '/comments/:commentId/change-liked',
    tokenMiddleware.auth,

    commentController.changeLikedIcon,
)

router.put(
    '/comments/:commentId/change-liked/reply',
    tokenMiddleware.auth,

    commentController.changeLikedReplyIcon,
)

router.post(
    '/comments/:commentId/reply',
    tokenMiddleware.auth,

    commentController.replyToComment,
)

router.put(
    '/comments/:commentId/edit',
    tokenMiddleware.auth,

    commentController.editComment,
)

router.put(
    '/comments/:commentId/edit/reply',
    tokenMiddleware.auth,

    commentController.editReplyComment,
)

router.delete(
    '/comments/:commentId/delete',
    tokenMiddleware.auth,

    commentController.deleteComment,
)

router.delete(
    '/comments/:commentId/delete/:replyId/reply',
    tokenMiddleware.auth,

    commentController.deleteReplyComment,
)

router.put(
    '/:movieId',
    tokenMiddleware.auth,

    authorizeMiddleware.allowAdminOnly,
    movieController.updateMovie,
)

router.post(
    '/',
    body('title')
        .exists()
        .withMessage('Tiêu đề không được trống.')
        .isLength({ min: 2 })
        .withMessage('Tiêu đề phải dài hơn 2 ký tự'),
    body('logo').exists().withMessage('Logo không được trống.'),
    body('duration').exists().withMessage('Thời gian phim không được trống'),
    body('release_date').exists().withMessage('Ngày phát hành không được trống.'),
    body('poster_path').exists().withMessage('Đường dẫn poster không được trống.'),
    body('overview').exists().withMessage('Mô tả phim không được trống.'),
    body('trailer').exists().withMessage('Trailer không được trống.'),
    body('video').exists().withMessage('Video không được trống.'),
    body('genres').exists().withMessage('Thể loại không được trống.'),
    body('episodes').exists().withMessage('Tập phim không được trống.'),
    body('casts').exists().withMessage('Diễn viên không được trống.'),
    body('program_type').exists().withMessage('Thể loại chương trình không được trống.'),
    body('age_rating').exists().withMessage('Giới hạn độ tuổi không được trống.'),
    // body('creators').exists().withMessage('Tác giả không được trống.'),
    body('item_genre').exists().withMessage('Thể loại không được trống.'),
    tokenMiddleware.auth,

    authorizeMiddleware.allowAdminOnly,
    requestHandler.validate,
    movieController.createMovie,
)

router.get('/:movieId/episodes', movieController.episodeList)

router.delete(
    '/:filmId',
    tokenMiddleware.auth,

    authorizeMiddleware.allowAdminOnly,
    movieController.deleteMovie,
)

export default router
