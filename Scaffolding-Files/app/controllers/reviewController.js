const review = require('../models/review').review;
const User = require('../models/User').User;

exports.getReview = async (req, res ) => {
    try {
        const {reviewId} = req.params;
        const reviewInstance = new review(reviewId, null, null, null);
        const review = await reviewInstance.getReview();

        if (review) {
            res.json(review); // Send review as JSON
        } else {
            res.status(404).json({message: "Review not found"});
        }
    } catch (error) {
        console.error("Error getting review:", error);
        res.status(500).send(error.toString());
    }
};