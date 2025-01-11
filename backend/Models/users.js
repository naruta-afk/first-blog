const mongoose = require('mongoose');
const joi = require('joi');
const jwt = require('jsonwebtoken');
//user schema
const userSchema = new mongoose.Schema({
    username: {
        
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
   email: {
        
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
        unique: true,
    },
    password: {
        
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
        unique: true,
    },
    profilePhoto: {
        type : Object,
        default: {url:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
                  publicId  :null}

        },
        bio : {
            type: String,
            
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isAccountVerified: {
            type: Boolean,
            default: false
        },
},{timestamps: true}); 


//generate the token(JWT)
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({  id: this._id , isAdmin: this.isAdmin}, process.env.JWT_SECRET);
};

//User model
const User = mongoose.models.User || mongoose.model('User', userSchema);
//validate the user inputs

function validateRegistereUser(user) {
    const schema = joi.object({
        username: joi.string().trim().min(2).max(100).required(),
        email: joi.string().trim().min(5).max(100).required().email(),
        password: joi.string().trim().min(8).required(),
    });
    return schema.validate(user);
}
function validateLoginUser(user) {
    const schema = joi.object({
        email: joi.string().trim().min(5).max(100).required().email(),
        password: joi.string().trim().min(8).required(),
    });
    return schema.validate(user);
}

function validateUpdateUser(user) {
    const schema = joi.object({
        username: joi.string().trim().min(2).max(100),
        password: joi.string().trim().min(8),
        bio: joi.string(),
    });
    return schema.validate(user);
}

module.exports = {
    User,
    validateRegistereUser,
    validateLoginUser,
    validateUpdateUser
};