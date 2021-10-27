const f2flocal = require('../models/f2flocal');
const Review = require('../models/review')

module.exports.criarReview = async (req, res) => {
    const local = await f2flocal.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    local.reviews.push(review);
    await review.save();
    await local.save();
    req.flash('success', 'Um novo review foi adicionado ao local!')
    res.redirect(`/f2flocal/${local._id}`)
}

module.exports.deletarReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await f2flocal.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Um novo review removido do local!')
    res.redirect(`/f2flocal/${id}`);

}