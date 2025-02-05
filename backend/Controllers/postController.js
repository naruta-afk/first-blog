const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');
const { Post , validatePost, validateUpdatePost} = require('../Models/post');
const { cloudinaryUploadImage, cloudinaryDeleteImage}= require('../utils/cloudinary');
const {Comment}= require ("../Models/comment");






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


  // get all posts
  const getAllPostsCtrl = asyncHandler(async (req, res) => {
    const POST_PER_PAGE = 3;
    const {pageNumber , category}= req.query;
    let posts;
    if(pageNumber){
      posts = await Post.find().skip((pageNumber - 1) * POST_PER_PAGE).limit(POST_PER_PAGE).sort({createdAt : -1}).populate('user',["-password"]);
    }else if (category){
      posts = await Post.find({category}).skip((pageNumber - 1) * POST_PER_PAGE).limit(POST_PER_PAGE).sort({createdAt : -1}).populate('user',["-password"]);
    }else{
      posts = await Post.find().sort({createdAt : -1}).populate('user',["-password"]);
    }
    res.status(200).json(posts);   
  });


  // get single post by id
  const getPostCtrl = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate('user',["-password"]).populate('comments');
    if(!post){ 
      return res.status(404).json({message:"Post not found"});
    }
    res.status(200).json(post);
  });
//get post count
const getPostCountCtrl = asyncHandler(async (req, res) => {
  const postCount = await Post.countDocuments();
  res.status(200).json(postCount);
});
//delete post
const deletePostCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if(!post){ 
    return res.status(404).json({message:"Post not found"});
  }
   if(req.user.isAdmin || req.user.id === post.user.toString()){
     await Post.findByIdAndDelete(req.params.id);
     await cloudinaryDeleteImage(post.image.public_id);

      //delete all comments related to the post
      await Comment.deleteMany({postId : post._id});

     res.status(200).json({message:"Post deleted successfully",postId : post._id});
   }else{
     return res.status(403 ).json({message:"You are not authorized to delete this post"});
   }
});


// update post
 const updatePostCtrl = asyncHandler(async (req, res) => {
  const {error }= validateUpdatePost(req.body);
  if(error){
    return res.status(400).json({message:error.details[0].message});
  }
  const post = await Post.findById(req.params.id);
  if(!post){
    return res.status(404).json({message:"Post not found"});
  }
  if(req.user.id !== post.user.toString()){
    
    return res.status(403 ).json({message:"You are not authorized to update this post"});
  }
  const updatedPost = await Post.findByIdAndUpdate(req.params.id,req.body,{
    $set : {
      title : req.body.title,
      description : req.body.description,
      category : req.body.category
    }
  },{new : true}).populate('user',["-password"]);

  res.status(200).json(updatedPost);

})
//update post Image
const updatePostImageCtrl = asyncHandler(async (req, res) => {
  if(!req.file){
    return res.status(400).json({ message: 'No Image uploaded' });
  }
  const post = await Post.findById(req.params.id);
  if(!post){
    return res.status(404).json({message:"Post not found"});
  }
  if(req.user.id !== post.user.toString()){
    return res.status(403 ).json({message:"You are not authorized to update this post"});
  }
  await cloudinaryDeleteImage(post.image.public_id);
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);
  const updatedPost = await Post.findByIdAndUpdate(req.params.id,{
    $set : {
      image : {
        url : result.secure_url,
        public_id : result.public_id
      }
    }
  },{new : true}).populate('user',["-password"]);
  res.status(200).json(updatedPost);
  fs.unlinkSync(imagePath);


})

//Toggling like 
const toggleLikeCtrl = asyncHandler(async (req, res) => {
 let post = await Post.findById(req.params.id);
 if(!post){
    return res.status(404).json({message:"Post not found"});
 }
const isPostLiked = post.likes.find((user)=> user.toString() === req.user.id);
if(isPostLiked){
  post = await Post.findByIdAndUpdate(req.params.id,{
    $pull : {
      likes : req.user.id
    }
  },{new : true});
}else{
  post = await Post.findByIdAndUpdate(req.params.id,{
    $push : {
      likes : req.user.id
    }
  },{new : true});
}
res.status(200).json(post);

})


module.exports = {
  createPostCtrl,
   getAllPostsCtrl, 
   getPostCtrl,
   updatePostCtrl,
   deletePostCtrl,
   updatePostImageCtrl,
    toggleLikeCtrl,
   getPostCountCtrl}
 


