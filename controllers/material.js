const Material = require('../models/Material');
const MaterialCategory = require('../models/MaterialCategory');
const User = require('../models/User');
const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');


exports.create = async (req, res) => {
    try {
         let form = new formidable.IncomingForm();
     form.keepExtensions = true;
     form.parse(req, (err, fields, files) => {
         if (err) {
             return res.status(400).json({
                 error: 'Image could not upload'
             });
         }
 
         const { title,forSlug,subtitle,language,desc,materialCategories,mainCat,subCat,standard,materialType, body } = fields;
 
         if (!title || !title.length) {             
             return res.status(400).json({
                 error: 'title is required'
             });
         }
 
         if (!body || body.length < 50) {
             return res.status(400).json({
                 error: 'Content is too short'
             });
         }
 
         if (!materialCategories || materialCategories.length === 0) {
             return res.status(400).json({
                 error: 'At least one category is required'
             });
         }
         if (!forSlug || !forSlug.length) {
            return res.status(400).json({
                error: 'Slug is required'
            });
        }
        if (!language || !language.length) {
            return res.status(400).json({
                error: 'Language is required'
            });
        }
        if (!subtitle || !subtitle.length) {
            return res.status(400).json({
                error: 'Sub-Title is required'
            });
        }
        if (!desc || !desc.length) {
            return res.status(400).json({
                error: 'Description is required'
            });
        }
        if (!mainCat || !mainCat.length) {
            return res.status(400).json({
                error: 'Main Category is required'
            });
        }
        if (!subCat || !subCat.length) {
            return res.status(400).json({
                error: 'Sub-Category is required'
            });
        }
        if (!standard || !standard.length) {
            return res.status(400).json({
                error: 'Standard is required'
            });
        }
        if (!materialType || !materialType.length) {
            return res.status(400).json({
                error: 'Material Type is required'
            });
        }
 
 
         let material = new Material();
         material.title = title;
         material.body = body;
         material.forSlug=forSlug;
         material.subtitle = subtitle;
         material.slug = slugify(forSlug).toLowerCase();
         material.desc =desc;
         material.postedBy = req.user._id;
         material.language =language;
         material.mainCat =mainCat;
         material.subCat =subCat;
         material.standard =standard;
         material.materialType =materialType;
         let arrayOfCategories = materialCategories && materialCategories.split(',');

      
 
         if (files.photo) {
             if (files.photo.size > 10000000) {
                 return res.status(400).json({
                     error: 'Image should be less then 1mb in size'
                 });
             }
             material.photo.data = fs.readFileSync(files.photo.path);
             material.photo.contentType = files.photo.type;
         }
 
         material.save((err, result) => {
             if (err) {
                 console.log(err)
                 return res.status(400).json({
                     error: errorHandler(err)
                 });
             }
             Material.findByIdAndUpdate(result._id, { $push: { materialCategories: arrayOfCategories } }, { new: true }).exec(
                 (err, result) => {
                     if (err) {
                        console.log(err)
                         return res.status(400).json({
                             error: errorHandler(err)
                         });
                     }  else {
                        res.json(result);
                    }
                 }
             );
         });
     });
    } catch (err) {
         console.error(err.message);
          res.status(500).send('Server error');
    }
 };

 
exports.updateMat = async (req, res) => {
    try {
        const slug = req.params.slug.toLowerCase();

        await Material.findOne({ slug }).exec((err, oldMat) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            let form = new formidable.IncomingForm();
            form.keepExtensions = true;

            form.parse(req, (err, fields, files) => {
                if (err) {
                    return res.status(400).json({
                        error: 'Image could not upload'
                    });
                }

                let slugBeforeMerge = oldMat.slug;
                oldMat = _.merge(oldMat, fields);
                oldMat.slug = slugBeforeMerge;

                const { title,forSlug,subtitle,language,desc,materialCategories,mainCat,subCat,standard,materialType, body} = fields;

   

                if (materialCategories) {
                    oldmaterial.materialCategories = materialCategories.split(',');
                }


                if (files.photo) {
                    if (files.photo.size > 10000000) {
                        return res.status(400).json({
                            error: 'Image should be less then 1mb in size'
                        });
                    }
                    oldMat.photo.data = fs.readFileSync(files.photo.path);
                    oldMat.photo.contentType = files.photo.type;
                }

                oldMat.save((err, result) => {
                    console.log(err);
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }
                    res.json(result);
                });
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

};

exports.controlledList = async (req, res) => {
    try {
        let limit = req.body.limit ? parseInt(req.body.limit) : 10;
        let skip = req.body.skip ? parseInt(req.body.skip) : 0;

        let materials;
        let materialCategories;
        

        Material.find({}).sort({ updatedAt: -1 })
            .populate('materialCategories', '_id name slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('_id title slug subtitle language desc materialCategories mainCat subCat standard materialType createdAt updatedAt')
            .exec((err, data) => {
                if (err) {
                    return res.json({
                        error: errorHandler(err)
                    });
                }
                materials = data;
                MaterialCategory.find({}).exec((err, c) => {
                    if (err) {
                        return res.json({
                            error: errorHandler(err)
                        });
                    }
                    materialCategories = c;
                    res.json({ materials, materialCategories, size: materials.length });

                });
            });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

 exports.photo = async (req, res) => {
    try {
         const slug = req.params.slug.toLowerCase();
         Material.findOne({ slug })
        .select('photo')
        .exec((err, material) => {
            if (err || !material) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.set('Content-Type', material.photo.contentType);
            return res.send(material.photo.data);
        });
    } catch (err) {
         console.error(err.message);
         res.status(500).send('Server error');
    }
   
};

exports.read =async (req, res) => {
    try {
        const slug = req.params.slug.toLowerCase();
        Material.findOne({ slug }).lean()
        .populate('materialCategories', '_id name slug')
        .populate('postedBy', '_id name username facebook insta twitter linkedin')
        .select('_id title slug photo materialCategories mainCat downloadLink faq language subCat standard desc materialType subtitle postedBy body createdAt updatedAt').lean()
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
    } catch (err) {
         console.error(err.message);
         res.status(500).send('Server error');
    }
    
};

exports.createFaq=async (req,res)=>{
    const slug=req.params.slug.toLowerCase()
    const {ques,ans}=req.body
    const newFaq={ques,ans}
    try {

       const material= await Material.findOne({slug})
        material.faq.unshift(newFaq);
        await material.save();
        res.json(material)
        console.log(newFaq)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
        
    }
}
exports.createLinks=async (req,res)=>{
    const slug=req.params.slug.toLowerCase()
    const {linkName,link}=req.body
    const newLink={linkName,link}
    try {

       const material= await Material.findOne({slug})
        material.downloadLink.unshift(newLink);
        await material.save();
        res.json(material)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
        
    }
}
exports.list=async (req,res)=>{


    try {
        Material.find({}).sort({ updatedAt: -1 })
            .populate('postedBy',' _id name username')
            .select('_id title mainCat subCat desc body standard postedBy materialType slug forSlug photo  createdAt updatedAt')
            .exec((err, data) => {
                if (err) {
                    return res.json({
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

exports.removeMat = async (req, res) => {
    try {
        const slug = req.params.slug.toLowerCase();
        await Material.findOneAndRemove({ slug }).exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json({
                message: 'Study Material deleted successfully'
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.listRelated = async (req, res) => {
    try {
        const { _id, materialCategories } = req.body;

        Material.find({ _id: { $ne: _id }, materialCategories: { $in: materialCategories }}).sort({ updatedAt: -1 })
            .limit(5)

            .select('_id title slug desc photo materialType mainCat subCat createdAt updatedAt')
            .exec((err, materials) => {
                if (err) {
                    return res.status(400).json({
                        error: 'Materials not found'
                    }).catch({ key: req.body.material._id });

                }
                res.json(materials);
            });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

};

