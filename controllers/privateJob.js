const PrivateJob = require('../models/PrivateJob');
const PrivateJobCategory = require('../models/PrivateJobCategory');
const PrivateJobTag = require('../models/PrivateJobTag');
const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/blog');

exports.createPvt =async (req, res) => {
try {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            });
        }

        const { title, body,agency, privateJobCategories,salary,qualification,lastDate,type,location,keySkills,position, privateJobTags,applyLink } = fields;

        if (!title || !title.length) {
            return res.status(400).json({
                error: 'title is required'
            });
        }

        if (!body || body.length < 100) {
            return res.status(400).json({
                error: 'Content is too short'
            });
        }

        if (!privateJobCategories || privateJobCategories.length === 0) {
            return res.status(400).json({
                error: 'At least one category is required'
            });
        }

        if (!privateJobTags || privateJobTags.length === 0) {
            return res.status(400).json({
                error: 'At least one tag is required'
            });
        }
        if (!salary || !salary.length) {
            return res.status(400).json({
                error: 'salary is required'
            });
        }
        if (!applyLink || !applyLink.length) {
            return res.status(400).json({
                error: 'Link is required'
            });
        }
        if (!qualification || !qualification.length) {
            return res.status(400).json({
                error: 'salary is required'
            });
        }
        if (!type || !type.length) {
            return res.status(400).json({
                error: 'type is required'
            });
        }
        if (!location || !location.length) {
            return res.status(400).json({
                error: 'location is required'
            });
        }
        if (!lastDate || !lastDate.length) {
            return res.status(400).json({
                error: 'Last Date is required'
            });
        }

        let privateJob = new PrivateJob();
        privateJob.title = title;
        privateJob.body = body;
        privateJob.agency=agency;
        privateJob.salary = salary;
        privateJob.applyLink=applyLink;
        privateJob.type = type;
        privateJob.position=position;
        privateJob.keySkills=keySkills;
        privateJob.location = location;
        privateJob.qualification=qualification;
        privateJob.lastDate = lastDate;
        privateJob.excerpt = smartTrim(body, 320, ' ', ' ...');
        privateJob.slug = slugify(title).toLowerCase();
        privateJob.mtitle = `${title} | ${process.env.APP_NAME}`;
        privateJob.mdesc = stripHtml(body.substring(0, 160)).result;
        
        let arrayOfCategories = privateJobCategories && privateJobCategories.split(',');
        let arrayOfTags = privateJobTags && privateJobTags.split(',');
        

        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less then 1mb in size'
                });
            }
            privateJob.photo.data = fs.readFileSync(files.photo.path);
            privateJob.photo.contentType = files.photo.type;
        }
       
        privateJob.save((err, result) => {
            console.log(err)
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            PrivateJob.findByIdAndUpdate(result._id, { $push: { privateJobCategories: arrayOfCategories } }, { new: true }).exec(
                (err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    } else {
                        PrivateJob.findByIdAndUpdate(result._id, { $push: { privateJobTags: arrayOfTags } }, { new: true }).exec(
                            (err, result) => {
                                if (err) {
                                    return res.status(400).json({
                                        error: errorHandler(err)
                                    });
                                } else {
                                    res.json(result);
                                }
                            }
                        );
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

exports.listPvt =async (req, res) => {
   try {
       await PrivateJob.find({}).sort({updatedAt:-1})
        .populate('privateJobCategories', '_id name slug')
        .populate('privateJobTags', '_id name slug')
        .select('_id title slug excerpt privateJobCategories applyLink privateJobTags keySkills position salary agency type lastDate qualification location  createdAt updatedAt')
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

exports.listPvtHome =async (req, res) => {
    try {
        await PrivateJob.find({}).sort({updatedAt:-1}).limit(10)
         .select('_id title slug excerpt createdAt updatedAt')
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
 
exports.listAllPvtJobsCategoriesTags =async (req, res) => {
try {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let privateJobs;
    let privateJobCategories;
    let privateJobTags;

    await PrivateJob.find({}).sort({updatedAt:-1})
        .populate('privateJobCategories', '_id name slug')
        .populate('privateJobTags', '_id name slug')
        
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id title slug excerpt privateJobCategories applyLink privateJobTags keySkills position salary agency type location qualification lastDate createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            privateJobs = data;
            PrivateJobCategory.find({}).exec((err, c) => {
                if (err) {
                    return res.json({
                        error: errorHandler(err)
                    });
                }
                privateJobCategories = c; 
                PrivateJobTag.find({}).exec((err, t) => {
                    if (err) {
                        return res.json({
                            error: errorHandler(err)
                        });
                    }
                    privateJobTags = t;
                    res.json({ privateJobs, privateJobCategories, privateJobTags, size: privateJobs.length });
                });
            });
        });  
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
}
};

exports.readPvt =async (req, res) => {
try {
    const slug = req.params.slug.toLowerCase();
    await PrivateJob.findOne({ slug })
        .populate('privateJobCategories', '_id name slug')
        .populate('privateJobTags', '_id name slug')
        
        .select('_id title body slug mtitle mdesc applyLink privateJobCategories privateJobTags position keySkills salary agency location qualification type lastDate createdAt updatedAt')
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

exports.removePvtJob =async (req, res) => {
try {
    const slug = req.params.slug.toLowerCase();
    await PrivateJob.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Job deleted successfully'
        });
    });
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
}
};


exports.updatePvtJob = async (req, res) => {
    try {
       const slug = req.params.slug.toLowerCase();

   await PrivateJob.findOne({ slug }).exec((err, oldJob) => {
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

            let slugBeforeMerge = oldJob.slug;
            oldJob = _.merge(oldJob, fields);
            oldJob.slug = slugBeforeMerge;

            const { body, desc, jobCategories, jobTags,salary,agency,keySkills,position ,applyLink,qualification,location,lastDate,type } = fields;

            if (body) {
                oldJob.excerpt = smartTrim(body, 320, ' ', ' ...');
                oldJob.desc = stripHtml(body.substring(0, 160));
            }

            if (privateJobCategories) {
                oldJob.privateJobCategories = privateJobCategories.split(',');
            }

            if (privateJobTags) {
                oldJob.privateJobTags = privateJobTags.split(',');
            }
            if (qualification) {
                oldJob.qualification = qualification.split(',');
            }

            if (files.photo) {
                if (files.photo.size > 10000000) {
                    return res.status(400).json({
                        error: 'Image should be less then 1mb in size'
                    });
                }
                oldJob.photo.data = fs.readFileSync(files.photo.path);
                oldJob.photo.contentType = files.photo.type;
            }

          oldJob.save((err, result) => {
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

exports.photo = async (req, res) => {
    try {
         const slug = req.params.slug.toLowerCase();
    PrivateJob.findOne({ slug })
        .select('photo')
        .exec((err, privateJob) => {
            if (err || !privateJob) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.set('Content-Type', privateJob.photo.contentType);
            return res.send(privateJob.photo.data);
        });
    } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error'); 
    }
   
};
exports.listRelatedPvt = async (req, res) => {
    try {
    let limit = req.body.limit ? parseInt(req.body.limit) : 5;
    const { _id, privateJobCategories } = req.body.privateJob;

    PrivateJob.find({ _id: { $ne: _id }, privateJobCategories: { $in: privateJobCategories } }).sort({updatedAt:-1})
        .limit(limit)
        
        .select('title slug excerpt agency applyLink createdAt updatedAt')
        .exec((err, privateJobs) => {
            if (err) {
                return res.status(400).json({
                    error: 'Jobs not found'
                });
               
            }
            res.json(privateJobs);
        });
    } catch (err) {
        console.error(err.message);
       res.status(500).send('Server error'); 
    }
  
};

exports.listSearchPvt =async (req, res) => {
    try {
         const { search } = req.query;
    if (search) {
      await PrivateJob.find(
            {
                $or: [{ title: { $regex: search, $options: 'i' } }, { body: { $regex: search, $options: 'i' } },{ location: { $regex: search, $options: 'i' } }]
            },
            (err, privateJobs) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(privateJobs);
            }
        ).select('-photo -body');
    }
    } catch (err) {
       console.error(err.message);
       res.status(500).send('Server error'); 
    }
   
};

