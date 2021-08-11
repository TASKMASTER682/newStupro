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
            .select('_id title slug excerpt  postedBy createdAt updatedAt ')
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


exports.update = (req, res) => {
        let form = new formidable.IncomingForm();
        form.keepExtension = true;
        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Photo could not be uploaded'
                });
            }
            let user = req.profile;
            user = _.extend(user, fields);
    
            if (fields.password && fields.password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be min 6 characters long'
                });
            }
    
            if (files.photo) {
                if (files.photo.size > 10000000) {
                    return res.status(400).json({
                        error: 'Image should be less than 1mb'
                    });
                }
                user.photo.data = fs.readFileSync(files.photo.path);
                user.photo.contentType = files.photo.type;
            }
            if(fields.skills){
                fields.skills.split(',')
                .map(skills=>skills.trim());
            }
    
            user.save((err, result) => {
                if (err) {
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



exports.addExp=async (req,res)=>{
    const id=req.user.id
    const {title,location,company,from,to,current,description}=req.body
    const newExp={title,location,company,from,to,current,description}
    try {

       const user= await User.findOne({id})
        user.experience.unshift(newExp);
        await user.save();
        res.json(user)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
        
    }
}

exports.addEdu=async (req,res)=>{
    const id=req.user.id
    const {school,degree,fieldOfStudy,from,to,current,description}=req.body
    const newEdu={school,degree,fieldOfStudy,from,to,current,description}
    try {

       const user= await User.findOne({id})
        user.education.unshift(newEdu);
        await user.save();
        res.json(user)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
        
    }
}

exports.removeExp=async (req,res)=>{
    try {
        const profile=await User.findOne({user:req.user.id});
        //get remove index
        const removeIndex=profile.experience.map(item=>item.id).indexOf
        (req.params.exp_id);
        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
        
    }
};

exports.removeEdu=async (req,res)=>{
    try {
        const profile=await User.findOne({user:req.user.id});
        //get remove index
        const removeIndex=profile.education.map(item=>item.id).indexOf
        (req.params.edu_id);
        profile.education.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
        
    }
};