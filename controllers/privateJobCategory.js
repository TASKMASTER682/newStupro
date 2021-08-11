const PrivateJobCategory = require('../models/PrivateJobCategory');
const PrivateJob=require('../models/PrivateJob')
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.createPvt=async (req,res)=>{
    try {
        const { name } = req.body;
        let slug = slugify(name).toLowerCase();
    
        let privateJobCategory =await new PrivateJobCategory({ name, slug });
    
       await privateJobCategory.save((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.listPvt=async (req,res)=>{
 try {
    PrivateJobCategory.find({}).exec((err, data) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: errorHandler(err)
            })
        
            ;
        }
        res.json(data);
    });
 } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
 }
}

exports.readPvt=async(req,res)=>{
    try {
        const slug = req.params.slug.toLowerCase();

        PrivateJobCategory.findOne({ slug }).exec((err, privateJobCategory) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            // res.json(category);
            PrivateJob.find({ privateJobCategories: privateJobCategory }).sort({updatedAt:-1})
                .populate('privateJobCategories', '_id name slug')
                .populate('privateJobTags', '_id name slug')
                .limit(30)
                .select('_id title slug salary applyLink  agency location lastDate type jobCategories jobTags createdAt updatedAt')
                .exec((err, data) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }
                    res.json({ privateJobCategory: privateJobCategory, privateJobs: data });
                });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.removePvt=async (req,res)=>{
    try {
        const slug = req.params.slug.toLowerCase();

        await PrivateJobCategory.findOneAndRemove({ slug }).exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json({
                message: 'Category deleted successfully'
            });
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}