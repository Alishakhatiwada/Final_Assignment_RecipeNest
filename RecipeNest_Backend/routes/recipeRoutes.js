const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const auth = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.post('/', auth, upload.single('image'), recipeController.createRecipe);
router.get('/', recipeController.getAllRecipes);
router.get('/chef', auth, recipeController.getChefRecipes);
router.get('/:id', recipeController.getRecipeById);
router.put('/:id', auth, upload.single('image'), recipeController.updateRecipe);
router.delete('/:id', auth, recipeController.deleteRecipe);
router.post('/:id/save', auth, recipeController.toggleSaveRecipe);
router.post('/:id/view', recipeController.incrementViews);

module.exports = router;
