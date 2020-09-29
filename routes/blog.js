const express = require('express');
const router = express.Router();
const { create, list, listAllBlogsCategoriesTags, read, remove, update,photo,  listRelated,listSearch } = require('../controllers/blog');

const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/blog', requireSignin, adminMiddleware, create);


module.exports = router;