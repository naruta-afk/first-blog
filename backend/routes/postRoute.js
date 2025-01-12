const router = require('express').Router();
const { createPostCtrl } = require('../Controllers/postController');
const photoUpload = require('../middlewares/photoUpload');
const {verifyToken} = require('../middlewares/verifyToken');

router.route('/').post(verifyToken, photoUpload.single("image"), createPostCtrl);


module.exports = router;
