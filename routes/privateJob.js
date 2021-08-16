const express = require('express');
const router = express.Router();
const routeCache=require('../middleware/routeCache')
const { createPvt, listPvt, listAllPvtJobsCategoriesTags, readPvt, removePvtJob, updatePvtJob,photo,  listRelatedPvt,createFaq,listPvtHome} = require('../controllers/privateJob');

const { requireSignin, adminMiddleware} = require('../controllers/auth');

router.post('/privateJob', requireSignin, adminMiddleware, createPvt);
router.get('/privateJobs', listPvt);
router.get('/privateJobsHome',routeCache(300), listPvtHome);
router.post('/privateJobs-categories-tags', listAllPvtJobsCategoriesTags);
router.get('/privateJobs/:slug',routeCache(300), readPvt);
router.delete('/privateJobs/:slug', requireSignin, adminMiddleware, removePvtJob);
router.put('/privateJobs/:slug', requireSignin, adminMiddleware, updatePvtJob);
router.get('/privateJobs/photo/:slug', photo);
router.post('/privateJobs/related', listRelatedPvt);
router.put('/privateJobs/faq/:slug',requireSignin,adminMiddleware,createFaq);


module.exports = router;