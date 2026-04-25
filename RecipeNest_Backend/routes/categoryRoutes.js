const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/authMiddleware');

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
};

router.get('/', categoryController.getCategories);
router.post('/', auth, isAdmin, categoryController.addCategory);
router.delete('/:id', auth, isAdmin, categoryController.deleteCategory);
router.put('/:id', auth, isAdmin, categoryController.updateCategory);

module.exports = router;
