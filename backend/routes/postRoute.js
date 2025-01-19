const router = require('express').Router();
const { createPostCtrl, getAllPostsCtrl, getPostCtrl, getPostCountCtrl, deletePostCtrl } = require('../Controllers/postController');
const photoUpload = require('../middlewares/photoUpload');
const {verifyToken} = require('../middlewares/verifyToken');
const validateObject = require('../middlewares/validateObject');

router.route('/').post(verifyToken, photoUpload.single("image"), createPostCtrl).get(getAllPostsCtrl);
//route post count
router.route('/count').get(getPostCountCtrl);

router.route('/:id').get(validateObject,getPostCtrl);
router.route('/:id').delete(verifyToken,validateObject, deletePostCtrl);
module.exports = router;
