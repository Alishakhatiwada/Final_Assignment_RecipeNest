const Review = require('../models/Review');
const Recipe = require('../models/Recipe');
const Notification = require('../models/Notification');

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const recipeId = req.params.recipeId;

    const newReview = new Review({
      recipe: recipeId,
      user: req.user.id,
      rating,
      comment
    });

    const review = await newReview.save();

    // Optionally update average rating of the recipe (simplified)
    const reviews = await Review.find({ recipe: recipeId });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    
    await Recipe.findByIdAndUpdate(recipeId, { rating: avgRating.toFixed(1) });

    // CREATE NOTIFICATION FOR CHEF
    const recipe = await Recipe.findById(recipeId).populate('chef');
    if (recipe && recipe.chef) {
      const notification = new Notification({
        user: recipe.chef._id,
        title: 'New Review Received!',
        message: `Someone just reviewed your recipe "${recipe.title}".`,
        type: 'NewReview'
      });
      await notification.save();
    }

    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getRecipeReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ recipe: req.params.recipeId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllReviews = async (req, res) => {
  try {
     const reviews = await Review.find()
       .populate('user', 'username email')
       .populate('recipe', 'title')
       .sort({ createdAt: -1 });
     res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteReview = async (req, res) => {
  try {
     const review = await Review.findById(req.params.id);
     if (!review) return res.status(404).json({ msg: 'Review not found' });
     
     // Check permissions: Admin or Recipe Owner (Chef)
     const recipe = await Recipe.findById(review.recipe);
     if (req.user.role !== 'admin' && recipe.chef.toString() !== req.user.id) {
       return res.status(403).json({ msg: 'Not authorized' });
     }

     await Review.findByIdAndDelete(req.params.id);
     
     // Recalculate average rating
     const reviews = await Review.find({ recipe: review.recipe });
     const avgRating = reviews.length > 0 
       ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1)
       : 0;
     
     await Recipe.findByIdAndUpdate(review.recipe, { rating: avgRating });

     res.json({ msg: 'Review removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
exports.getChefReviews = async (req, res) => {
  try {
     // Find all recipes by this chef
     const recipes = await Recipe.find({ chef: req.user.id });
     const recipeIds = recipes.map(r => r._id);
     
     // Find all reviews for those recipes
     const reviews = await Review.find({ recipe: { $in: recipeIds } })
       .populate('user', 'username email avatar')
       .populate('recipe', 'title')
       .sort({ createdAt: -1 });
       
     res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
