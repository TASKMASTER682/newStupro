const express = require('express');
const router = express.Router();
const { requireSignin, authMiddleware} = require('../controllers/auth');
const { read, publicProfile,update,photo,addExp,addEdu,removeExp,removeEdu,getMyProfile} = require('../controllers/user');

router.get('/user/profile', requireSignin, authMiddleware, read);
router.get('/user/:username', publicProfile);
router.put('/user/update', requireSignin, authMiddleware, update);
router.get('/user/photo/:username', photo);
router.put('/user/addExperience', requireSignin, authMiddleware, addExp);
router.put('/user/addEducation', requireSignin, authMiddleware, addEdu);
router.delete('/user/education/:edu_id', requireSignin, authMiddleware, removeEdu);
router.delete('/user/experience/:exp_id', requireSignin, authMiddleware, removeExp);

module.exports = router;