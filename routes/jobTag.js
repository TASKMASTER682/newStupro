const express=require('express');
const router=express.Router();
const routeCache=require('../middleware/routeCache')
const {create, list, read, remove}=require('../controllers/jobTag');

//validators
const {runValidation}=require('../validators');
const {createTagValidator}=require('../validators/tag');
const {requireSignin,adminMiddleware}=require('../controllers/auth');


router.post('/jobTag',createTagValidator,runValidation,requireSignin,adminMiddleware,create);
router.get('/jobTags',routeCache(300), list);
router.get('/jobTags/:slug',routeCache(300), read);
router.delete('/jobTag/:slug', requireSignin, adminMiddleware, remove);

module.exports=router;