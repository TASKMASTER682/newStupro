const JobTag = require('../models/JobTag');
const Job = require('../models/Job');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create=async (req,res)=>{
try {
    const { name } = req.body;
    let slug = slugify(name).toLowerCase();

    let jobTag = new JobTag({ name, slug });

    await jobTag.save((err, data) => {
        if (err) {
            console.log(err);
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

exports.read=async (req,res)=>{
    try {
        const slug = req.params.slug.toLowerCase();

        JobTag.findOne({ slug }).exec((err, jobTag) => {
            if (err) {
                return res.status(400).json({
                    error: 'Tag not found'
                });
            }
            Job.find({ jobTags: jobTag }).sort({updatedAt:-1})
                .populate('jobCategories', '_id name slug')
                .populate('jobTags', '_id name slug')
                .limit(30)
                .select('_id title slug applyLink salary lastDate location agency type jobCategories  jobTags createdAt updatedAt')
                .exec((err, data) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }
                    res.json({ jobTag: jobTag, jobs: data });
                });
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.list=async (req,res)=>{
    try {
        JobTag.find({}).exec((err, data) => {
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

exports.remove=async (req,res)=>{
    try {
        const slug = req.params.slug.toLowerCase();

       await JobTag.findOneAndRemove({ slug }).exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json({
                message: 'Tag deleted successfully'
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}