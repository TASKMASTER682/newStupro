const express = require('express');
const router = express.Router();
const { createPvt, listPvt, listAllPvtJobsCategoriesTags, readPvt, removePvtJob, updatePvtJob,photo,  listRelatedPvt,listSearchPvt ,listPvtHome} = require('../controllers/privateJob');

const { requireSignin, adminMiddleware} = require('../controllers/auth');

router.post('/privateJob', requireSignin, adminMiddleware, createPvt);
router.get('/privateJobs', listPvt);
router.get('/privateJobsHome', listPvtHome);
router.post('/privateJobs-categories-tags', listAllPvtJobsCategoriesTags);
router.get('/privateJob/:slug', readPvt);
router.delete('/privateJob/:slug', requireSignin, adminMiddleware, removePvtJob);
router.put('/privateJob/:slug', requireSignin, adminMiddleware, updatePvtJob);
router.get('/privateJob/photo/:slug', photo);
router.post('/privateJobs/related', listRelatedPvt);
router.get('/privateJobs/search', listSearchPvt);


module.exports = router;