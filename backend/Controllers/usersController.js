const asyncHandler = require('express-async-handler');
const { User } = require('../models/users');

/**
 * @desc   Get all users
 * @route  GET /api/users/profile
 * @access Public
 */
const getAllUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = {
  getAllUsersCtrl,
};