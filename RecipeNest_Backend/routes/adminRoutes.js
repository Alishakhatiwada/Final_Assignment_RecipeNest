const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');

// Simple middleware to check if admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied: Admin only' });
  }
  next();
};

router.get('/users', auth, isAdmin, adminController.getAllUsers);
router.delete('/users/:id', auth, isAdmin, adminController.deleteUser);
router.get('/chefs', auth, isAdmin, adminController.getAllChefs);
router.patch('/users/:id/status', auth, isAdmin, adminController.updateUserStatus);
router.patch('/recipes/:id/status', auth, isAdmin, adminController.moderateRecipe);
router.get('/stats', auth, isAdmin, adminController.getDashboardStats);

module.exports = router;
