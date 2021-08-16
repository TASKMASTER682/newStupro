const express = require('express');
const router = express.Router();
const routeCache=require('../middleware/routeCache')
const { create, list, listAllJobsCategoriesTags, read, removeJob, updateJob,photo, listRelated ,listHome,listResult,listAdmit,createFaq,createLinks} = require('../controllers/job');

const { requireSignin, adminMiddleware} = require('../controllers/auth');

router.post('/job', requireSignin, adminMiddleware, create);
router.get('/jobs',  list);
router.get('/jobsHome',routeCache(300), listHome);
router.get('/jobsAdmit',routeCache(300), listAdmit);
router.get('/jobsResult',routeCache(300), listResult);
router.post('/jobs-categories-tags', listAllJobsCategoriesTags);
router.get('/jobs/:slug',routeCache(300), read);
router.delete('/jobs/:slug', requireSignin, adminMiddleware, removeJob);
router.put('/jobs/:slug', requireSignin, adminMiddleware, updateJob);
router.get('/jobs/photo/:slug',routeCache(300), photo);
router.post('/jobs/related', listRelated);
router.put('/jobs/faq/:slug',requireSignin,adminMiddleware,createFaq);
router.put('/jobs/createLinks/:slug',requireSignin,adminMiddleware,createLinks);



module.exports = router;