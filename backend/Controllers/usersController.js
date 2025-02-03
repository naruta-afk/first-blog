const asyncHandler = require('express-async-handler');
const { User, validateUpdateUser } = require('../Models/users');
const bcrypt = require('bcryptjs');
const path = require('path');
const { cloudinaryUploadImage, cloudinaryDeleteImage, cloudinaryDeleteMultipleImage}= require('../utils/cloudinary');
const fs = require('fs');
const {Comment} = require('../Models/comment');
const {Post} = require('../Models/post');



/**
 * @desc   Get all users
 * @route  GET /api/users/profile
 * @access Public
 */
const getAllUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').populate('posts');
  res.json(users);
});

/**
 * @desc   Get user by ID
 * @route  GET /api/users/profile/:id
 * @access Public
 */
const getUserCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password').populate('posts');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);

});

// Update user
const updateUserCtrl = asyncHandler(async (req, res) => {
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
      },
    },
    { new: true }
  ).select('-password');
  res.status(200).json(updatedUser);
});
// Get User Count 
const getUsersContCtrl = asyncHandler(async (req, res) => {
  const cont = await User.countDocuments();
  res.json(cont);
});


/**
 * @desc   Profile Photo Upload
 * @route  POST /api/users/profile/profile-photo-upload
 * @access Private
 */
const profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);
  console.log(result);

  // Get user from DB
  const user = await User.findById(req.user.id); // Assuming req.user.id contains the user ID
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Delete old profile photo if it exists
  if (user.profilePhoto && user.profilePhoto.public_id) {
    await cloudinaryDeleteImage(user.profilePhoto.public_id);
  }

  // Change profile photo
  user.profilePhoto = {
    url: result.secure_url,
    public_id: result.public_id,
  };
  await user.save();

  res.status(200).json({
    message: 'Profile photo uploaded successfully',
    profilePhoto: { url: result.secure_url, public_id: result.public_id },
  });

  // Remove image from server
  fs.unlinkSync(imagePath);
});

/**
 * @desc   Delete user by ID
 * @route  DELETE /api/users/profile/:id
 * @access Private
 */
const deleteUserCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  //get all posts and comments by the user
  const posts = await Post.find({ user: user._id }); 
  //get the public ids fom the posts
  const publicIds = posts?.map(post => post.image.publicId);
  // delete all images from Cloudinary
  if (publicIds?.length > 0) {
    await cloudinaryDeleteMultipleImage(publicIds);
  }

  // Delete profile photo from Cloudinary
  
    await cloudinaryDeleteImage(user.profilePhoto.public_id);
    // Delete all posts and comments by the user
    await Post.deleteMany({ user: user._id });
    await Comment.deleteMany({ user: user._id });
  

  // Delete the user
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: 'Your account has been deleted' });
});

module.exports = {
  getAllUsersCtrl,
  getUserCtrl,
  updateUserCtrl,
  getUsersContCtrl,
  profilePhotoUploadCtrl,
  deleteUserCtrl,
};


