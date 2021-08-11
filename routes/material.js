const express = require('express');
const router = express.Router();
const routeCache=require('../middleware/routeCache')
const { create, list, read,createFaq,createLinks,photo,updateMat,removeMat,controlledList,listRelated} = require('../controllers/material');

const { requireSignin, adminMiddleware} = require('../controllers/auth');

router.post('/materials/create', requireSignin, adminMiddleware, create);
router.put('/materials/faq/:slug',requireSignin,adminMiddleware,createFaq);
router.put('/materials/createLinks/:slug',requireSignin,adminMiddleware,createLinks);
router.get('/materials', list);
router.get('/materials/:slug', read);
router.get('/materials/photo/:slug',routeCache(300), photo);
router.post('/materials/related', listRelated);
router.put('/materials/update/:slug', requireSignin, adminMiddleware, updateMat);
router.delete('/materials/delete/:slug', requireSignin, adminMiddleware, removeMat);
router.post('/materials/controlledList', controlledList);


module.exports = router;