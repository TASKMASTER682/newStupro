const express=require('express');
const router=express.Router();
const {create,list,read,remove}=require('../controllers/category');

const {runValidation}=require('../validators');
const {catagoryCreateValidator}=require('../validators/category');
const {requireSignin,adminMiddleware}=require('../controllers/auth');


router.post('/category',catagoryCreateValidator,runValidation,requireSignin,adminMiddleware,create);
router.get('/categories', list);
router.get('/category/:slug', read);
router.delete('/category/:slug', requireSignin, adminMiddleware, remove);

module.exports=router;