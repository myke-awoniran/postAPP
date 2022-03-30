const router = require('express').Router();
const authController = require('../controllers/authController');

router.get('/me', authController.protect, authController.getMe);
router.get('/users', authController.getAllUsers);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
module.exports = router;
