const router = require('express').Router();
const { getAllUsersCtrl, getUserCtrl, updateUserCtrl, getUsersContCtrl, profilePhotoUploadCtrl, deleteUserCtrl } = require('../Controllers/usersController');
const { verifyTokenAndAdmin, verifyTokenAndUser, verifyToken, verifyTokenAndAuthorization } = require('../middlewares/verifyToken');
const validateObject = require('../middlewares/validateObject');
const upload = require('../middlewares/photoUpload');

// /api/users/profile
router.route('/profile').get(verifyTokenAndAdmin, getAllUsersCtrl);

router.route('/profile/:id').get(validateObject, getUserCtrl);

router.route('/profile/:id').put(validateObject, verifyTokenAndUser, updateUserCtrl);
router.route('/count').get(verifyTokenAndAdmin, getUsersContCtrl);
router.route('/profile/profile-photo-upload').post(verifyToken, upload.single("image"), profilePhotoUploadCtrl);
router.route('/profile/:id').delete(validateObject, verifyTokenAndAuthorization, deleteUserCtrl);

module.exports = router;