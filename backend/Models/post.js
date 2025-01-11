const mongoose = require("mongoose");
const  joi = require("joi");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 200,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 200,
    },
    use : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: Object,
        default: {
            url : "",
            public_id :null
        },
    },
    likes:[
        {type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        }
    ]
},
{
    timestamps: true,
}
);

// post model
const postModel = mongoose.model("Post", postSchema);

//validate create post
function validatePost(post) {
    const schema = joi.object({
        title: joi.string().trim().min(2).max(200).required(),
        description: joi.string().trim().min(10).required(),
        category: joi.string().trim().required(),
    });
    return schema.validate(post);
}

// validate update post
function validateUpdatePost(post) {
    const schema = joi.object({
        title: joi.string().trim().min(2).max(200),
        description: joi.string().trim().min(10),
        category: joi.string().trim(),
    });
    return schema.validate(post);
}


module.exports = {
    postModel,
    validatePost,
    validateUpdatePost,
};