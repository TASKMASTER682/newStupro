const express = require('express');
const router = express.Router();
const { create, list, listAllJobsCategoriesTags, read, removeJob, updateJob,photo,  listRelated,listSearch ,listHome} = require('../controllers/job');

const { requireSignin, adminMiddleware} = require('../controllers/auth');

router.post('/job', requireSignin, adminMiddleware, create);
router.get('/jobs', list);
router.get('/jobsHome', listHome);
router.post('/jobs-categories-tags', listAllJobsCategoriesTags);
router.get('/job/:slug', read);
router.delete('/job/:slug', requireSignin, adminMiddleware, removeJob);
router.put('/job/:slug', requireSignin, adminMiddleware, updateJob);
router.get('/job/photo/:slug', photo);
router.post('/jobs/related', listRelated);
router.get('/jobs/search', listSearch);


module.exports = router;