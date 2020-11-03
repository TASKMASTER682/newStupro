const JobCategory = require('../models/JobCategory');
const Job=require('../models/Job')
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create=async (req,res)=>{
    try {
        const { name } = req.body;
        let slug = slugify(name).toLowerCase();
    
        let jobCategory =await new JobCategory({ name, slug });
    
       await jobCategory.save((err, data) => {
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

exports.list=async (req,res)=>{
 try {
   await JobCategory.find({}).exec((err, data) => {
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

exports.read=async(req,res)=>{
    try {
        const slug = req.params.slug.toLowerCase();

       await JobCategory.findOne({ slug }).exec((err, jobCategory) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            // res.json(category);
            Job.find({ jobCategories: jobCategory }).sort({updatedAt:-1})
                .populate('jobCategories', '_id name slug')
                .populate('jobTags', '_id name slug')
                
                .select('_id title slug excerpt salary applyLink qualification agency location lastDate type jobCategories jobTags createdAt updatedAt')
                .exec((err, data) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }
                    res.json({ jobCategory: jobCategory, jobs: data });
                });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.remove=async (req,res)=>{
    try {
        const slug = req.params.slug.toLowerCase();

        await JobCategory.findOneAndRemove({ slug }).exec((err, data) => {
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