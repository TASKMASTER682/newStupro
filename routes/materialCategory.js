const express=require('express');
const router=express.Router();
const routeCache=require('../middleware/routeCache')
const {create,list,readMatCat,removeMatCat}=require('../controllers/materialCategory');

//validators
const {runValidation}=require('../validators');
const {catagoryCreateValidator}=require('../validators/category');
const {requireSignin,adminMiddleware}=require('../controllers/auth');

router.post('/materialCategories/create',catagoryCreateValidator,runValidation,requireSignin,adminMiddleware,create);
router.get('/materialCategories', list);
router.get('/materialCategories/:slug', readMatCat);
router.delete('/materialCategory/:slug', requireSignin, adminMiddleware, removeMatCat);


module.exports=router;