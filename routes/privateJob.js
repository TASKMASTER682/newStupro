const express = require('express');
const router = express.Router();
const routeCache=require('../middleware/routeCache')
const { createPvt, listPvt, listAllPvtJobsCategoriesTags, readPvt, removePvtJob, updatePvtJob,photo,  listRelatedPvt,listSearchPvt ,listPvtHome} = require('../controllers/privateJob');

const { requireSignin, adminMiddleware} = require('../controllers/auth');

router.post('/privateJob', requireSignin, adminMiddleware, createPvt);
router.get('/privateJobs',routeCache(300), listPvt);
router.get('/privateJobsHome',routeCache(300), listPvtHome);
router.post('/privateJobs-categories-tags', listAllPvtJobsCategoriesTags);
router.get('/privateJob/:slug',routeCache(300), readPvt);
router.delete('/privateJob/:slug', requireSignin, adminMiddleware, removePvtJob);
router.put('/privateJob/:slug', requireSignin, adminMiddleware, updatePvtJob);
router.get('/privateJob/photo/:slug', photo);
router.post('/privateJobs/related', listRelatedPvt);
router.get('/privateJobs/search',routeCache(300), listSearchPvt);


module.exports = router;