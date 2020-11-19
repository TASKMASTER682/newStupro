const Tag = require('../models/Tag');
const Blog = require('../models/Blog');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create=async (req,res)=>{
try {
    const { name } = req.body;
    let slug = slugify(name).toLowerCase();

    let tag = new Tag({ name, slug });

    await tag.save((err, data) => {
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

       await Tag.findOne({ slug }).exec((err, tag) => {
            if (err) {
                return res.status(400).json({
                    error: 'Tag not found'
                });
            }
            // res.json(tag);
            Blog.find({ tags: tag })
                .populate('categories', '_id name slug')
                .populate('tags', '_id name slug')
                .populate('postedBy', '_id name photo')
                .select('_id title slug excerpt categories postedBy tags createdAt updatedAt')
                .exec((err, data) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }
                    res.json({ tag: tag, blogs: data });
                });
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.list=async (req,res)=>{
    try {
       await Tag.find({}).exec((err, data) => {
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

       await Tag.findOneAndRemove({ slug }).exec((err, data) => {
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