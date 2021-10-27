const { localSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError')
const f2flocal = require('./models/f2flocal');
const { reviewSchema } = require('./schemas.js')
const Review = require('./models/review.js')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //guardar url que o usuário estava pedindo ao servidor
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Você deve estar logado para ter acesso a isso.');
        return res.redirect('/login');
    }
    next();
}

module.exports.validarLocal = (req, res, next) => {
    const { error } = localSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const local = await f2flocal.findById(id);
    if (!local.author.equals(req.user._id)) {
        req.flash('error', 'Você não tem permissão para fazer isso!')
        return res.redirect(`/f2flocal/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Você não tem permissão para fazer isso!')
        return res.redirect(`/f2flocal/${id}`);
    }
    next();
}

module.exports.validarReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}