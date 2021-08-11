const express=require('express');
const router=express.Router();
const routeCache=require('../middleware/routeCache')
const {createPvt,listPvt,readPvt,removePvt}=require('../controllers/privateJobCategory');

//validators
const {runValidation}=require('../validators');
const {catagoryCreateValidator}=require('../validators/category');
const {requireSignin,adminMiddleware}=require('../controllers/auth');

router.post('/privateJobCategory',catagoryCreateValidator,runValidation,requireSignin,adminMiddleware,createPvt);
router.get('/privateJobCategories',routeCache(300), listPvt);
router.get('/privateJobCategories/:slug',routeCache(300), readPvt);
router.delete('/privateJobCategory/:slug', requireSignin, adminMiddleware, removePvt);

module.exports=router;