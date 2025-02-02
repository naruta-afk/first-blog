const asyncHandleer = require('express-async-handler');
const {Comment,validateCreateComment,validateUpdateComment}= require('../Models/comment');
const {User}= require('../Models/users');



/**
 * @desc Create a new comment
 * @route POST /api/comments
 * @access Private
 */

module.exports.createComment = asyncHandleer(async (req, res) => {
    const {error} = validateCreateComment(req.body);

    if(error) {return res.status(400).json({message:error.details[0].message})};

    const profile = await  User.findById(req.user.id);


    const comment = await Comment.create({
        postId:req.body.postId,
        text : req.body.text,
        userId : req.user.id,
        username : profile.username,
    });
    res.status(201).json(comment);
});



/**
 * @desc get all comments
 * @route GET /api/comments
 * @access Private (admin)
 */
module.exports.getAllComments = asyncHandleer(async(req ,res)=>{
    const comments = await Comment.find().populate("userId");
    res.status(200).json(comments);
});



/**
 * @desc Delete comments
 * @route DELETE /api/comments
 * @access Private (admin or ower of the comment)
 */
module.exports.deleteComments = asyncHandleer(async(req ,res)=>{
   const comment = await Comment.findById(req.params.id);
    if(!comment){ 
        return res.status(404).json({message:"Comment not found"})
    };
    if(req.user.isAdmin|| req.user.isAdmin === comment.user.toString()){
       await Comment.findByIdAndDelete(req.params.id);
       res.status(200).json({message:"Comment deleted successfully"});
}else{
    return res.status(403 ).json({message:"You are not authorized to delete this comment"});
}
}

);

