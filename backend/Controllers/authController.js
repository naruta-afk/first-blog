const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { User, validateUser } = require('../Models/users');


/**
 * @desc   Register a new user - Sign Up
 * @route    /api/auth/register
 * @access  Public
 * @method  POST
 */

module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
//validate the user inputs
const {error}=validateUser(req.body);
if(error){
  return  res.status(400).json({message:error.details[0].message});
    
}
// is user already registered
let user = await User.findOne({email:req.body.email});
if(user){
   return res.status(400).json({message:"User already registered"});
    
}
// hash the password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password,salt);
// save the user to the database
user = new User({
  username:req.body.username,
  email:req.body.email,
  password:hashedPassword
});
await user.save();
//send the response
res.status(201).json({message:"User registered successfully"});

});