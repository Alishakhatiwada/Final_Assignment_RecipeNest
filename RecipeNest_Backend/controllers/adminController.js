const User = require('../models/User');
const Recipe = require('../models/Recipe');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { $set: { status: req.body.status } }, 
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.moderateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id, 
      { $set: { status: req.body.status } }, 
      { new: true }
    );
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const recipeCount = await Recipe.countDocuments();
    const pendingRecipes = await Recipe.countDocuments({ status: 'Pending' });
    const totalViews = await Recipe.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]);
    
    res.json({
      users: userCount,
      recipes: recipeCount,
      pendingRecipes,
      totalViews: totalViews.length > 0 ? totalViews[0].total : 0,
      growthData: [
        { name: 'Jan', value: Math.floor(userCount * 0.4) },
        { name: 'Feb', value: Math.floor(userCount * 0.6) },
        { name: 'Mar', value: Math.floor(userCount * 0.8) },
        { name: 'Apr', value: userCount }
      ]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllChefs = async (req, res) => {
  try {
     const chefs = await User.find({ role: 'chef' }).select('-password');
     
     // For each chef, we want to know their recipe count and avg rating
     const chefsWithStats = await Promise.all(chefs.map(async (chef) => {
       const recipes = await Recipe.find({ chef: chef._id });
       const recipeCount = recipes.length;
       const avgRating = recipes.length > 0 
         ? (recipes.reduce((acc, r) => acc + (r.rating || 0), 0) / recipes.length).toFixed(1)
         : 0;
       
       return {
         ...chef._doc,
         recipes: recipeCount,
         rating: avgRating
       };
     }));

     res.json(chefsWithStats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
