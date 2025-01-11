const asyncHandler = require('express-async-handler');
const { User, validateUpdateUser } = require('../models/users');
const bcrypt = require('bcryptjs');

/**
 * @desc   Get all users
 * @route  GET /api/users/profile
 * @access Public
 */
const getAllUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

/**
 * @desc   Get user by ID
 * @route  GET /api/users/profile/:id
 * @access Public
 */
const getUserCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
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



module.exports = {
  getAllUsersCtrl,
  getUserCtrl,
  updateUserCtrl,
  getUsersContCtrl
 
};





