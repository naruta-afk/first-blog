const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');
const { Post , validatePost} = require('../Models/post');
const { cloudinaryUploadImage}= require('../utils/cloudinary');

// create new post
const createPostCtrl = asyncHandler(async (req, res) => {
if(!req.file){
    return res.status(400).json({ message: 'No Image uploaded' });
}
const {error}= validatePost(req.body);
if(error){
    return res.status(400).json({message:error.details[0].message});
}
const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
const result = await cloudinaryUploadImage(imagePath);
const post = await Post.create({
    title : req.body.title,
    description : req.body.description,
    image : {
        url : result.secure_url,
        public_id : result.public_id
    },
    category : req.body.category,
    user : req.user.id,
});

  res.json(post);

fs.unlinkSync(imagePath);

  });

module.exports = {createPostCtrl};


