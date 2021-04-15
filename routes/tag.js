const express=require('express');
const router=express.Router();
const routeCache=require('../middleware/routeCache')
const {create, list, read, remove}=require('../controllers/tag');

//validators
const {runValidation}=require('../validators');
const {createTagValidator}=require('../validators/tag');
const {requireSignin,adminMiddleware}=require('../controllers/auth');


router.post('/tag',createTagValidator,runValidation,requireSignin,adminMiddleware,create);
router.get('/tags',routeCache(300), list);
router.get('/tag/:slug',routeCache(300), read);
router.delete('/tag/:slug', requireSignin, adminMiddleware, remove);

module.exports=router;