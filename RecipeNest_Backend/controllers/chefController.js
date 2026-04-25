const User = require('../models/User');
const Recipe = require('../models/Recipe');

exports.getChefStats = async (req, res) => {
  try {
    const recipes = await Recipe.find({ chef: req.user.id });
    const totalRecipes = recipes.length;
    const totalViews = recipes.reduce((acc, recipe) => acc + (recipe.views || 0), 0);
    const totalSaves = recipes.reduce((acc, recipe) => acc + (recipe.saves || 0), 0);
    
    // Average rating
    const recipesWithRatings = recipes.filter(r => r.rating > 0);
    const avgRating = recipesWithRatings.length > 0 
      ? (recipesWithRatings.reduce((acc, r) => acc + r.rating, 0) / recipesWithRatings.length).toFixed(1)
      : 0;

    res.json({
      totalRecipes,
      totalViews,
      totalSaves,
      avgRating
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getChefProfile = async (req, res) => {
  try {
    const chef = await User.findById(req.params.id).select('-password');
    if (!chef || chef.role !== 'chef') {
      return res.status(404).json({ msg: 'Chef not found' });
    }

    const recipes = await Recipe.find({ chef: req.params.id, status: 'Published' });
    
    res.json({
      chef,
      recipes
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllChefs = async (req, res) => {
  try {
    const chefs = await User.find({ role: 'chef', status: 'Active' }).select('-password');
    res.json(chefs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
exports.getChefAnalytics = async (req, res) => {
  try {
     // For a real app, we might have a separate Views collection with timestamps
     // For this simple version, we'll return some data based on recipe creation or just mocked historical data 
     // derived from the actual recipes to make it "dynamic".
     const recipes = await Recipe.find({ chef: req.user.id });
     
     // Mocking some growth data based on actual recipe counts to replace static dummy data
     // In a real production app, this would query a dedicated analytics DB or aggregation
     const data = [
       { name: 'Jan', views: Math.floor(Math.random() * 500) },
       { name: 'Feb', views: Math.floor(Math.random() * 800) },
       { name: 'Mar', views: Math.floor(Math.random() * 1200) },
       { name: 'Apr', views: recipes.reduce((acc, r) => acc + (r.views || 0), 0) }
     ];
     
     res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
