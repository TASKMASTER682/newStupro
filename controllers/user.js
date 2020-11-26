const User = require('../models/User');
const Blog = require('../models/Blog');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.read =async (req, res) => {
    try {
        req.profile.hashed_password = undefined;
    
        return res.json(req.profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
  
};

exports.publicProfile =async (req, res) => {
   try {
    let username = req.params.username;
    let user;
    let blogs;

    User.findOne({ username }).select('-hashed_password').exec((err, userFromDB) => {
        if (err || !userFromDB) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        user = userFromDB;
        let userId = user._id;
         Blog.find({ postedBy: userId })
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name facebook linkedin insta twitter about')
            .limit(10)
            .select('_id title slug excerpt categories tags postedBy createdAt updatedAt ')
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
    res.status(500).send('Server error')
   }
};

exports.update =async (req, res) => {
   try {
    let form = new formidable.IncomingForm();
    form.keepExtension = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
 
        let user = req.profile;
        let existingRole = user.role;
        let existingEmail = user.email;
 
        if (fields && fields.username && fields.username.length > 12) {
            return res.status(400).json({
                error: 'Username should be less than 12 characters long'
            });
        }
 
        if (fields.username) {
            fields.username = slugify(fields.username).toLowerCase();
        }
 
        if (fields.password && fields.password.length < 6) {
            return res.status(400).json({
                error: 'Password should be min 6 characters long'
            });
        }
 
        user = _.extend(user, fields);
        user.role = existingRole;
        user.email = existingEmail;
 
        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb'
                });
            }
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }
 
        user.save((err, result) => {
            if (err) {
                console.log('profile udpate error', err);
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            user.photo = undefined;
            res.json(user);
        });
    });
   } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error')
   }
};


exports.getUsers=async (req,res)=>{
    try {
        const users=await User.find({}).populate('user',['name','photo']).sort({createdAt:-1});
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
        
    }
    };
exports.photo =async (req, res) => {
 try {
    const username = req.params.username;
    User.findOne({ username }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (user.photo.data) {
            res.set('Content-Type', user.photo.contentType);
            return res.send(user.photo.data);
        }
    });
 } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error')
 }
};
