const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewsControllers = require('../controllers/reviews.js')
const catchAsync = require('../utils/catchAsync.js')
const { validarReview, isLoggedIn, isReviewAuthor } = require('../middleware.js')

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewsControllers.deletarReview))

router.post('/', isLoggedIn, validarReview, catchAsync(reviewsControllers.criarReview))

module.exports = router;