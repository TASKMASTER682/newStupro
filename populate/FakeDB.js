const {blogs,jobs,privateJobs,users,privateJobTags,privateJobCategories,categories,tags,jobCategories,jobTags}=require('./data');
const Blog = require('../models/Blog');
const Job = require('../models/Job')
const PrivateJob = require('../models/PrivateJob')
const Category = require('../models/Category')
const Tag = require('../models/Tag')
const JobCategory = require('../models/JobCategory')
const JobTag = require('../models/JobTag')
const User = require('../models/User')
const PrivateJobCategory = require('../models/PrivateJobCategory')
const PrivateJobTag = require('../models/PrivateJobTag');

class FakeDB {

    async clean() {
      await User.deleteMany({});
      await Blog.deleteMany({});
      await Job.deleteMany({});
      await PrivateJob.deleteMany({});
      await Category.deleteMany({});
      await Tag.deleteMany({});
      await JobCategory.deleteMany({});
      await JobTag.deleteMany({});
      await PrivateJobCategory.deleteMany({});
      await PrivateJobTag.deleteMany({});

    }
  
    async addData() {
      await User.create(user);
      await Blog.create(blogs);
      await Job.create(jobs);
      await PrivateJob.create(privateJobs);
      await Category.create(categories);
      await Tag.create(tags);
      await JobTag.create(jobTags);
      await JobCategory.create(jobCategories);
      await PrivateJobCategory.create(privateJobCategories);
      await PrivateJobTag.create(privateJobTags);


    }
  
    async populate() {
      await this.clean();
      await this.addData();
    }
  }
  
  module.exports = new FakeDB()