const User = require('../models/User');
const Blog = require('../models/Blog');
const _ = require('lodash');//not installed yet
const formidable = require('formidable');//to handle uploaded form data like photo
const fs = require('fs');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.publicProfile =async (req, res) => {
   try {
    let username = req.params.username;
    let user;
    let blogs;

    User.findOne({ username }).exec((err, userFromDB) => {
        if (err || !userFromDB) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        user = userFromDB;
        let userId =await user._id;
        Blog.find({ postedBy: userId })
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name')
            .limit(10)
            .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                user.photo = undefined;
                user.hashed_password = undefined;
                res.json({
                    user,
                    blogs: data
                });
            });
    });
       
   } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error")
   }
};