const express = require('express');
const router = express.Router();
const chefController = require('../controllers/chefController');
const auth = require('../middleware/authMiddleware');

router.get('/stats', auth, chefController.getChefStats);
router.get('/analytics', auth, chefController.getChefAnalytics);
router.get('/profile/:id', chefController.getChefProfile);
router.get('/all', chefController.getAllChefs);

module.exports = router;
