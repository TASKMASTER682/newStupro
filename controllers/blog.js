const Blog = require('../models/Blog');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const User = require('../models/User');
const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/blog');

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

        const { title,forSlug,desc,language, subtitle,body, categories, tags } = fields;

        if (!title || !title.length) {
            return res.status(400).json({
                error: 'title is required'
            });
        }

        if (!body || body.length < 200) {
            return res.status(400).json({
                error: 'Content is too short'
            });
        }

        if (!categories || categories.length === 0) {
            return res.status(400).json({
                error: 'At least one category is required'
            });
        }

        if (!forSlug || forSlug.length === 0) {
            return res.status(400).json({
                error: 'Slug is required required'
            });
        }
                if (!desc || desc.length === 0) {
            return res.status(400).json({
                error: 'Description required'
            });
        }
        if (!tags || tags.length === 0) {
            return res.status(400).json({
                error: 'At least one tag is required'
            });
        }


        let blog = new Blog();
        blog.title = title;
        blog.subtitle=subtitle;
        blog.body = body;
        blog.language=language;
        blog.forSlug=forSlug;
        blog.excerpt = smartTrim(body, 320, ' ', ' ...');
        blog.slug = slugify(forSlug).toLowerCase();
        blog.desc = desc;
        blog.postedBy = req.user._id;
        let arrayOfCategories = categories && categories.split(',');
        let arrayOfTags = tags && tags.split(',');

        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less then 1mb in size'
                });
            }
            blog.photo.data = fs.readFileSync(files.photo.path);
            blog.photo.contentType = files.photo.type;
        }

        blog.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            
            Blog.findByIdAndUpdate(result._id, { $push: { categories: arrayOfCategories } }, { new: true }).exec(
                (err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    } else {
                        Blog.findByIdAndUpdate(result._id, { $push: { tags: arrayOfTags } }, { new: true }).exec(
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
         Blog.find({}).sort({updatedAt:-1})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username facebook insta twitter linkedin')
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
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

exports.listAllBlogsCategoriesTags = async (req, res) => {
    try {
         let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let blogs;
    let categories;
    let tags;

     Blog.find({}).sort({updatedAt:-1}).lean()
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username profile facebook insta twitter linkedin')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id title slug excerpt categories mdesc tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            blogs = data; 
            
            Category.find({}).exec((err, c) => {
                if (err) {
                    return res.json({
                        error: errorHandler(err)
                    });
                }
                categories = c; 
                Tag.find({}).exec((err, t) => {
                    if (err) {
                        return res.json({
                            error: errorHandler(err)
                        });
                    }
                    tags = t;
                    res.json({ blogs, categories, tags, size: blogs.length });
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
        Blog.findOne({ slug }).lean()
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username facebook insta twitter linkedin')
        .select('_id title body desc language slug faq subtitle categories tags postedBy createdAt updatedAt').lean()
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

exports.remove = async (req, res) => {
    try {
         const slug = req.params.slug.toLowerCase();
        await Blog.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Blog deleted successfully'
        });
    });
    } catch (err) {
         console.error(err.message);
         res.status(500).send('Server error');
    }
   
};


exports.update =async (req, res) => {
    try {
          const slug = req.params.slug.toLowerCase();

   await Blog.findOne({ slug }).exec((err, oldBlog) => {
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

            let slugBeforeMerge = oldBlog.slug;
            oldBlog = _.merge(oldBlog, fields);
            oldBlog.slug = slugBeforeMerge;

            const { body,title,subtitle, desc,language, categories, tags } = fields;

            if (body) {
                oldBlog.excerpt = smartTrim(body, 320, ' ', ' ...');
            }

            if (categories) {
                oldBlog.categories = categories.split(',');
            }

            if (tags) {
                oldBlog.tags = tags.split(',');
            }

            if (files.photo) {
                if (files.photo.size > 10000000) {
                    return res.status(400).json({
                        error: 'Image should be greater then 1mb in size'
                    });
                }
                oldBlog.photo.data = fs.readFileSync(files.photo.path);
                oldBlog.photo.contentType = files.photo.type;
            }

            oldBlog.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                // result.photo = undefined;
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
         Blog.findOne({ slug })
        .select('photo')
        .exec((err, blog) => {
            if (err || !blog) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.set('Content-Type', blog.photo.contentType);
            return res.send(blog.photo.data);
        });
    } catch (err) {
         console.error(err.message);
         res.status(500).send('Server error');
    }
   
};
exports.listRelated = async (req, res) => {
    try {
        const { _id, categories } = req.body;

        Blog.find({ _id: { $ne: _id }, categories: { $in: categories } }).sort({ updatedAt: -1 })
            .limit(5)

            .select('_id title slug excerpt photo createdAt updatedAt')
            .exec((err, blogs) => {
                if (err) {
                    return res.status(400).json({
                        error: 'Blogs not found'
                    })

                }
                res.json(blogs);
            });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

};

exports.listSearch = async (req, res) => {
    try {
         const { search } = req.query;
    if (search) {
       await Blog.find(
            {
                $or: [{ title: { $regex: search, $options: 'i' } }, { body: { $regex: search, $options: 'i' } }]
            },
            (err, posts) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(posts);
            }
        ).select('-photo -body');
    }
    } catch (err) {
         console.error(err.message);
         res.status(500).send('Server error');
    }
   
};

exports.listByUser = async (req, res) => {
    try {
         User.findOne({ username: req.params.username }).exec((err, user) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        let userId = user._id;
        Blog.find({ postedBy: userId }).sort({updatedAt:-1})
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name username')
            .select('_id title slug desc postedBy createdAt updatedAt')
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(data);
            });
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

       const blog= await Blog.findOne({slug})
        blog.faq.unshift(newFaq);
        await blog.save();
        res.json(blog)
        console.log(newFaq)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
        
    }
}

exports.removeFaq=async (req,res)=>{
    const slug=req.params.slug.toLowerCase()
    try {
        const blog=await Blog.findOne({slug});
        //get remove index
        const removeIndex=blog.faq.map(item=>item.id).indexOf
        (req.params.exp_id);
        blog.faq.splice(removeIndex,1);
        await blog.save();
        res.json(blog);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
        
    }
};
