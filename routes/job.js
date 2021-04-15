const express = require('express');
const router = express.Router();
const routeCache=require('../middleware/routeCache')
const { create, list, listAllJobsCategoriesTags, read, removeJob, updateJob,photo,  listRelated,listSearch ,listHome} = require('../controllers/job');

const { requireSignin, adminMiddleware} = require('../controllers/auth');

router.post('/job', requireSignin, adminMiddleware, create);
router.get('/jobs', routeCache(300), list);
router.get('/jobsHome',routeCache(300), listHome);
router.post('/jobs-categories-tags', listAllJobsCategoriesTags);
router.get('/job/:slug',routeCache(300), read);
router.delete('/job/:slug', requireSignin, adminMiddleware, removeJob);
router.put('/job/:slug', requireSignin, adminMiddleware, updateJob);
router.get('/job/photo/:slug', photo);
router.post('/jobs/related', listRelated);
router.get('/jobs/search', routeCache(300), listSearch);


module.exports = router;