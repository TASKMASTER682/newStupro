const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const privateJobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            min: 3,
            max: 160,
            required: true
        },
        slug: {
            type: String,
            unique: true,
            index: true
        },
        body: {
            type: {},
            required: true,
            min: 100,
            max: 2000000
        },
        excerpt: {
            type: String,
            max: 1000
        },
        mtitle: {
            type: String
        },
        mdesc: {
            type:{}
        },
        lastDate:{
         type:Date,
         required:true
        },
        location:{
            type:[String],
            required:true
        },
        salary:{
            type:[String],
            required:true
        },
        agency:{
            type:[String]
            
        },
        position:{
            type:String
            
        },
        keySkills:{
            type:[String]
            
        },
        qualification:{
         type:[String],
         required:true
        },
        type:{
            type:String,
            required:true
        },
      applyLink:{
          type:String,
          required:true
      },
        photo: {
            data: Buffer,
            contentType: String
        },
        privateJobCategories: [{ type: ObjectId, ref: 'PrivateJobCategory', required: true }],
        privateJobTags: [{ type: ObjectId, ref: 'PrivateJobTag', required: true }],
      
    },
    { timestamps: true }
);

module.exports = mongoose.model('PrivateJob', privateJobSchema);