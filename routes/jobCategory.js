const express=require('express');
const router=express.Router();
const routeCache=require('../middleware/routeCache')
const {create,list,read,remove}=require('../controllers/jobCategory');

//validators
const {runValidation}=require('../validators');
const {catagoryCreateValidator}=require('../validators/category');
const {requireSignin,adminMiddleware}=require('../controllers/auth');

router.post('/jobCategory',catagoryCreateValidator,runValidation,requireSignin,adminMiddleware,create);
router.get('/jobCategories',routeCache(300), list);
router.get('/jobCategories/:slug',routeCache(300), read);
router.delete('/jobCategory/:slug', requireSignin, adminMiddleware, remove);

module.exports=router;