const Job = require('../models/Job');
const JobCategory = require('../models/JobCategory');
const JobTag = require('../models/JobTag');
const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/blog');

exports.create =async (req, res) => {
try {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            });
        }

        const { title, body,agency, jobCategories,salary,affiliateLink,qualification,lastDate,type,location, jobTags,applyLink } = fields;

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

        if (!jobCategories || jobCategories.length === 0) {
            return res.status(400).json({
                error: 'At least one category is required'
            });
        }

        if (!jobTags || jobTags.length === 0) {
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

        let job = new Job();
        job.title = title;
        job.body = body;
        job.agency=agency;
        job.salary = salary;
        job.applyLink=applyLink;
        job.type = type;
        job.location = location;
        job.qualification=qualification;
        job.lastDate = lastDate;
        job.excerpt = smartTrim(body, 320, ' ', ' ...');
        job.slug = slugify(title).toLowerCase();
        job.mtitle = `${title} | ${process.env.APP_NAME}`;
        job.mdesc = stripHtml(body.substring(0, 160)).result;
        
        let arrayOfCategories = jobCategories && jobCategories.split(',');
        let arrayOfTags = jobTags && jobTags.split(',');
        

        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less then 1mb in size'
                });
            }
            job.photo.data = fs.readFileSync(files.photo.path);
            job.photo.contentType = files.photo.type;
        }
       
        job.save((err, result) => {
            console.log(err)
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            Job.findByIdAndUpdate(result._id, { $push: { jobCategories: arrayOfCategories } }, { new: true }).exec(
                (err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    } else {
                        Job.findByIdAndUpdate(result._id, { $push: { jobTags: arrayOfTags } }, { new: true }).exec(
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

exports.list =async (req, res) => {
   try {
        Job.find({}).sort({updatedAt:-1})
        .populate('jobCategories', '_id name slug')
        .populate('jobTags', '_id name slug')
        .select('_id title slug excerpt jobCategories applyLink jobTags salary agency type lastDate qualification location  createdAt updatedAt')
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

exports.listHome =async (req, res) => {
    try {
         Job.find({}).sort({updatedAt:-1}).limit(10)
         .select('_id title slug excerpt lastDate createdAt updatedAt')
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

 
exports.listAllJobsCategoriesTags =async (req, res) => {
try {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let jobs;
    let jobCategories;
    let jobTags;

      Job.find({}).sort({updatedAt:-1})
        .populate('jobCategories', '_id name slug')
        .populate('jobTags', '_id name slug')
        
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id title slug excerpt jobCategories applyLink jobTags salary agency type location qualification lastDate createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            jobs = data;
            JobCategory.find({}).exec((err, c) => {
                if (err) {
                    return res.json({
                        error: errorHandler(err)
                    });
                }
                jobCategories = c; 
                JobTag.find({}).exec((err, t) => {
                    if (err) {
                        return res.json({
                            error: errorHandler(err)
                        });
                    }
                    jobTags = t;
                    res.json({ jobs, jobCategories, jobTags, size: jobs.length });
                });
            });
        });  
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
}
};

exports.read =async (req, res) => {
try {
    const slug = req.params.slug.toLowerCase();
     Job.findOne({ slug })
        .populate('jobCategories', '_id name slug')
        .populate('jobTags', '_id name slug')
        
        .select('_id title body slug mtitle mdesc applyLink jobCategories jobTags salary agency location qualification type lastDate createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        })
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
}
};

exports.removeJob =async (req, res) => {
try {
    const slug = req.params.slug.toLowerCase();
    await Job.findOneAndRemove({ slug }).exec((err, data) => {
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


exports.updateJob = async (req, res) => {
    try {
       const slug = req.params.slug.toLowerCase();

   await Job.findOne({ slug }).exec((err, oldJob) => {
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

            const { body, desc, jobCategories, jobTags,salary,agency ,applyLink,qualification,location,lastDate,type } = fields;

            if (body) {
                oldJob.excerpt = smartTrim(body, 320, ' ', ' ...');
                oldJob.desc = stripHtml(body.substring(0, 160));
            }

            if (jobCategories) {
                oldJob.jobCategories = jobCategories.split(',');
            }

            if (jobTags) {
                oldJob.jobTags = jobTags.split(',');
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
    Job.findOne({ slug })
        .select('photo')
        .exec((err, job) => {
            if (err || !job) {
                return res.status(400).json({
                    error: errorHandler(err)
                }).cache({key:slug});
            }
            res.set('Content-Type', job.photo.contentType);
            return res.send(job.photo.data);
        });
    } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error'); 
    }
   
};
exports.listRelated = async (req, res) => {
    try {
    let limit = req.body.limit ? parseInt(req.body.limit) : 5;
    const { _id, jobCategories } = req.body.job;

    Job.find({ _id: { $ne: _id }, jobCategories: { $in: jobCategories } }).sort({updatedAt:-1})
        .limit(limit)
        
        .select('title slug excerpt agency applyLink createdAt updatedAt')
        .exec((err, jobs) => {
            if (err) {
                return res.status(400).json({
                    error: 'Jobs not found'
                }).catch({key:req.body.job._id});
               
            }
            res.json(jobs);
        });
    } catch (err) {
        console.error(err.message);
       res.status(500).send('Server error'); 
    }
  
};

exports.listSearch =async (req, res) => {
    try {
         const { search } = req.query;
    if (search) {
      await Job.find(
            {
                $or: [{ title: { $regex: search, $options: 'i' } }, { body: { $regex: search, $options: 'i' } },{ location: { $regex: search, $options: 'i' } }]
            },
            (err, jobs) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(jobs);
            }
        ).select('-photo -body').sort({updatedAt:-1});
    }
    } catch (err) {
       console.error(err.message);
       res.status(500).send('Server error'); 
    }
   
};

