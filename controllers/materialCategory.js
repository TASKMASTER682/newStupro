const MaterialCategory = require('../models/MaterialCategory');
const Material=require('../models/Material')
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create=async (req,res)=>{
    try {
        const { name } = req.body;
        let slug = slugify(name).toLowerCase();
    
        let materialCategory =await new MaterialCategory({ name, slug });
    
        await materialCategory.save((err, data) => {
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
    MaterialCategory.find({}).exec((err, data) => {
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

exports.readMatCat=async(req,res)=>{
    try {
        const slug = req.params.slug.toLowerCase();

         MaterialCategory.findOne({ slug }).exec((err, materialCategory) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            // res.json(category);
            Material.find({ materialCategories: materialCategory })
                .populate('materialCategories', '_id name slug')
                .populate('postedBy', '_id name photo username')
                .select('_id title slug desc materialCategories postedBy createdAt updatedAt')
                .limit(30)
                .exec((err, data) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }
                    res.json({ materialCategory: materialCategory, materials: data });
                });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}


exports.removeMatCat=async (req,res)=>{
    try {
        const slug = req.params.slug.toLowerCase();

        await MaterialCategory.findOneAndRemove({ slug }).exec((err, data) => {
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