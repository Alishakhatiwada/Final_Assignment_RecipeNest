const Recipe = require('../models/Recipe');
const User = require('../models/User');

exports.createRecipe = async (req, res) => {
  try {
    const { title, description, category, difficulty, cookingTime, servings, status } = req.body;
    
    let ingredients = req.body.ingredients || req.body['ingredients[]'] || [];
    let instructions = req.body.instructions || req.body['instructions[]'] || [];
    
    if (!Array.isArray(ingredients)) ingredients = [ingredients];
    if (!Array.isArray(instructions)) instructions = [instructions];

    const recipeData = {
      title,
      description,
      chef: req.user.id,
      category,
      ingredients,
      instructions,
      cookingTime,
      servings,
      difficulty,
      status: status || 'Pending'
    };

    if (req.file) {
       recipeData.image = `/uploads/${req.file.filename}`;
    }

    const newRecipe = new Recipe(recipeData);
    const recipe = await newRecipe.save();
    res.json(recipe);
  } catch (err) {
    console.error('Error creating recipe:', err);
    res.status(500).json({ msg: 'Server Error', details: err.message });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const { category, search, difficulty, sort } = req.query;
    let query = { status: 'Published' };

    if (category && category !== 'All') {
      query.category = { $regex: category, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    let sortQuery = { createdAt: -1 };
    if (sort === 'popular') sortQuery = { views: -1 };
    if (sort === 'rating') sortQuery = { rating: -1 };

    const recipes = await Recipe.find(query)
      .populate('chef', 'username avatar')
      .sort(sortQuery);
      
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getChefRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ chef: req.user.id });
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('chef', 'username');
    if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });

    // Check ownership or admin role
    if (recipe.chef.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const updateData = { ...req.body };
    
    if (req.body['ingredients[]'] !== undefined) {
      let ing = req.body['ingredients[]'];
      updateData.ingredients = Array.isArray(ing) ? ing : [ing];
      delete updateData['ingredients[]'];
    } else if (req.body.ingredients && !Array.isArray(req.body.ingredients)) {
      updateData.ingredients = [req.body.ingredients];
    }
    
    if (req.body['instructions[]'] !== undefined) {
      let inst = req.body['instructions[]'];
      updateData.instructions = Array.isArray(inst) ? inst : [inst];
      delete updateData['instructions[]'];
    } else if (req.body.instructions && !Array.isArray(req.body.instructions)) {
      updateData.instructions = [req.body.instructions];
    }

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    recipe = await Recipe.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
    res.json(recipe);
  } catch (err) {
    console.error('Update Recipe error:', err.message);
    res.status(500).json({ msg: 'Server Error', details: err.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });

    if (recipe.chef.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Recipe removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.toggleSaveRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const recipeId = req.params.id;

    const index = user.savedRecipes.indexOf(recipeId);
    if (index > -1) {
      user.savedRecipes.splice(index, 1);
      await user.save();
      await Recipe.findByIdAndUpdate(recipeId, { $inc: { saves: -1 } });
      res.json({ msg: 'Recipe unsaved', saved: false });
    } else {
      user.savedRecipes.push(recipeId);
      await user.save();
      await Recipe.findByIdAndUpdate(recipeId, { $inc: { saves: 1 } });
      res.json({ msg: 'Recipe saved', saved: true });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.incrementViews = async (req, res) => {
  try {
    await Recipe.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ msg: 'View incremented' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
