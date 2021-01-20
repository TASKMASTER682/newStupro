const express=require('express');
const router=express.Router();
const {createPvt, listPvt, readPvt, removePvt}=require('../controllers/privateJobTag');

//validators
const {runValidation}=require('../validators');
const {createTagValidator}=require('../validators/tag');
const {requireSignin,adminMiddleware}=require('../controllers/auth');


router.post('/privateJobTag',createTagValidator,runValidation,requireSignin,adminMiddleware,createPvt);
router.get('/privateJobTags', listPvt);
router.get('/privateJobTag/:slug', readPvt);
router.delete('/privateJobTag/:slug', requireSignin, adminMiddleware, removePvt);

module.exports=router;