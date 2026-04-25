const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true }, // Using string category for now to match frontend simplified structure
  ingredients: [{ type: String }],
  instructions: [{ type: String }],
  cookingTime: { type: String },
  servings: { type: String },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  image: { type: String, default: null },
  rating: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Pending', 'Published', 'Reported'], 
    default: 'Pending' 
  },
  views: { type: Number, default: 0 },
  saves: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', recipeSchema);
