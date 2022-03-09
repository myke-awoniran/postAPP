const router = require('express').Router();
const feedController = require('../controllers/feedController');
const authController = require('../controllers/authController');

router.get('/', feedController.home);
router.get('/posts', feedController.getPosts);
router.use(authController.protect);
//all routes below  are all protected
router.post('/post', feedController.addPost);
router.get('/post/:postId', feedController.getPost);
router.delete('/post/:postId', feedController.deletePost);
router.patch('/post/:postId', feedController.updatePost);
module.exports = router;
