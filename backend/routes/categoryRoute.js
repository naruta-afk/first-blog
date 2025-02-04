const   router = require('express').Router();
const { createCategory, getAllCategory, deleteCategory } = require('../Controllers/categoryController');
const  {verifyTokenAndAdmin}= require ("../middlewares/verifyToken")
const validateObject = require('../middlewares/validateObject');




// api/categories
router.route('/')
.post(verifyTokenAndAdmin, createCategory)
.get(getAllCategory);
router.route('/:id').delete(validateObject,verifyTokenAndAdmin,deleteCategory);




module.exports = router;