const router = require('express').Router();
const { createComment, getAllComments, deleteComments } = require('../Controllers/commentController');
const {verifyToken,verifyTokenAndAdmin}= require('../middlewares/verifyToken')
const validateObject = require('../middlewares/validateObject');




router.route('/').post(verifyToken,createComment);
router.route('/').get(verifyTokenAndAdmin, getAllComments);

router.route('/:id').delete(validateObject,verifyToken, deleteComments);

module.exports = router;