const Category = require('../models/Category');
const Blog=require('../models/Blog')
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create=async (req,res)=>{
    try {
        const { name } = req.body;
        let slug = slugify(name).toLowerCase();
    
        let category =await new Category({ name, slug });
    
        await category.save((err, data) => {
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
    Category.find({}).exec((err, data) => {
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

exports.read=async(req,res)=>{
    try {
        const slug = req.params.slug.toLowerCase();

         Category.findOne({ slug }).exec((err, category) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            // res.json(category);
            Blog.find({ categories: category })
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
                    res.json({ category: category, blogs: data });
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

        await Category.findOneAndRemove({ slug }).exec((err, data) => {
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