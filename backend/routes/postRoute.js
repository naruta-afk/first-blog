const router = require('express').Router();
const { createPostCtrl, getAllPostsCtrl, getPostCtrl, getPostCountCtrl, deletePostCtrl,updatePostCtrl, updatePostImageCtrl, toggleLikeCtrl} = require('../Controllers/postController');
const photoUpload = require('../middlewares/photoUpload');
const {verifyToken} = require('../middlewares/verifyToken');
const validateObject = require('../middlewares/validateObject');

router.route('/').post(verifyToken, photoUpload.single("image"), createPostCtrl).get(getAllPostsCtrl);
//route post count
router.route('/count').get(getPostCountCtrl);

router.route('/:id').get(validateObject,getPostCtrl);
router.route('/:id').delete(verifyToken,validateObject, deletePostCtrl);
router.route('/:id').put(verifyToken,validateObject,updatePostCtrl);
router.route('/update-image/:id').put(validateObject,verifyToken,photoUpload.single("image"),updatePostImageCtrl);

router.route('/like/:id').put(validateObject,verifyToken,toggleLikeCtrl);

module.exports = router;
