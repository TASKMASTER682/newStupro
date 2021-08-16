const express = require('express');
const router = express.Router();
const routeCache=require('../middleware/routeCache')
const { create, list, listAllBlogsCategoriesTags, read, remove, update,photo,  listRelated,listSearch, listByUser,createFaq,removeFaq} = require('../controllers/blog');

const { requireSignin, adminMiddleware,authMiddleware,  canUpdateDeleteBlog } = require('../controllers/auth');

router.post('/blog', requireSignin, adminMiddleware, create);
router.get('/blogs',list);
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags);
router.get('/blogs/:slug', read);
router.delete('/blogs/:slug', requireSignin, adminMiddleware, remove);
router.put('/blogs/:slug', requireSignin, adminMiddleware, update);
router.get('/blogs/photo/:slug',routeCache(300), photo);
router.post('/blogs/related', listRelated);
router.get('/blogs/search', listSearch);
router.put('/blogs/faq/:slug',requireSignin,adminMiddleware,createFaq);
router.delete('/blogs/faq/:slug',requireSignin,adminMiddleware,removeFaq);

// auth user blog crud
router.post('/user/blogs',requireSignin, authMiddleware, create);
router.get('blogs/:username',routeCache(300), listByUser);
router.delete('/user/blogs/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, remove);
router.put('/user/blogs/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, update);



module.exports = router;