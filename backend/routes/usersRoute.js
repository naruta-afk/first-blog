const router = require('express').Router();
const { getAllUsersCtrl, getUserCtrl, updateUserCtrl, getUsersContCtrl } = require('../controllers/usersController');
const { verifyTokenAndAdmin, verifyTokenAndUser } = require('../middlewares/verifyToken');
const validateObject = require('../middlewares/validateObject');

// /api/users/profile
router.route('/profile').get(verifyTokenAndAdmin, getAllUsersCtrl);

router.route('/profile/:id').get(validateObject, getUserCtrl);

router.route('/profile/:id').put(validateObject, verifyTokenAndUser, updateUserCtrl);
router.route('/count').get(verifyTokenAndAdmin, getUsersContCtrl);
module.exports = router;