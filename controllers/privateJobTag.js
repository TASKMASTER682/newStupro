const PrivateJobTag = require('../models/PrivateJobTag');
const PrivateJob = require('../models/PrivateJob');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.createPvt=async (req,res)=>{
try {
    const { name } = req.body;
    let slug = slugify(name).toLowerCase();

    let privateJobTag = new PrivateJobTag({ name, slug });

    await privateJobTag.save((err, data) => {
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

exports.readPvt=async (req,res)=>{
    try {
        const slug = req.params.slug.toLowerCase();

        PrivateJobTag.findOne({ slug }).exec((err, privateJobTag) => {
            if (err) {
                return res.status(400).json({
                    error: 'Tag not found'
                });
            }
            // res.json(tag);
            PrivateJob.find({ privateJobTags: privateJobTag }).sort({updatedAt:-1})
                .populate('privateJobCategories', '_id name slug')
                .populate('privateJobTags', '_id name slug')
                .limit(30)
                .select('_id title slug applyLink salary lastDate location agency type  jobCategories  jobTags createdAt updatedAt')
                .exec((err, data) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }
                    res.json({ privateJobTag: privateJobTag, privateJobs: data });
                });
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.listPvt=async (req,res)=>{
    try {
        PrivateJobTag.find({}).exec((err, data) => {
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

exports.removePvt=async (req,res)=>{
    try {
        const slug = req.params.slug.toLowerCase();

       await PrivateJobTag.findOneAndRemove({ slug }).exec((err, data) => {
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