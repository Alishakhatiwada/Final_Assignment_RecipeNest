const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);
router.put('/profile', auth, upload.single('avatar'), authController.updateProfile);
router.put('/change-password', auth, authController.changePassword);
router.get('/user/:id', auth, authController.getUserById);

module.exports = router;
