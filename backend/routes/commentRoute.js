const router = require('express').Router();
const { createComment, getAllComments, deleteComments, updatecomment } = require('../Controllers/commentController');
const {verifyToken,verifyTokenAndAdmin}= require('../middlewares/verifyToken')
const validateObject = require('../middlewares/validateObject');




router.route('/').post(verifyToken,createComment);
router.route('/').get(verifyTokenAndAdmin, getAllComments);

router.route('/:id').delete(validateObject,verifyToken, deleteComments)
.put(validateObject,verifyToken,updatecomment);

module.exports = router;