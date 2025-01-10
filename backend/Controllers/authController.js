const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { User, validateRegistereUser, validateLoginUser} = require('../Models/users');


/**
 * @desc   Register a new user - Sign Up
 * @route    /api/auth/register
 * @access  Public
 * @method  POST
 */

module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
//validate the user inputs
const {error}=validateRegistereUser(req.body);
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
//@TODO  sending email (verification)
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

/**
 * @desc   Login a user - Sign IN
 * @route    /api/auth/login
 * @access  Public
 * @method  POST
 */

module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
// validate the user inputs
const {error}= validateLoginUser (req.body);
if(error){
  return  res.status(400).json({message:error.details[0].message});
    
}
// is user registered
let user = await User.findOne({email:req.body.email});
if(!user){
  return res.status(400).json({message:"User not registered"});
    
}
// check the password
const validPassword = await bcrypt.compare(req.body.password,user.password);
if(!validPassword){
  return res.status(400).json({message:"Invalid password"});
    
}
//@TODO  sending email (verification)
//generate the token(JWT)
const token = user.generateAuthToken();

//send the response
res.status(200).json({
  _id : user._id,
  isAdmin:user.isAdmin,
  profilePhoto :user.profilePhoto,
  token,
});


});