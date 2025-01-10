const mongoose = require('mongoose');

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




//User model
const User = mongoose.model('User', userSchema);

module.exports = {
    User
};