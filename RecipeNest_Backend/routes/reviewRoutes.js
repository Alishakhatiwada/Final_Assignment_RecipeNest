const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });
  next();
};

router.post('/:recipeId', auth, reviewController.addReview);
router.get('/chef', auth, reviewController.getChefReviews);
router.get('/:recipeId', reviewController.getRecipeReviews);
router.get('/', auth, isAdmin, reviewController.getAllReviews);
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;
