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
        forSlug:{
            type:String
        },
        subtitle:{
            type:String
        },
        desc:{
            type:String
        },
        officialLink:{
            type:String
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
        language:{
            type:String,
            default:'en'
        },
        faq:[
            {
                ques:{
                    type:String
                },
                ans:{
                    type:String
                }
            }
        ],

        lastDate:{
         type:Date,
         required:true
        },
        location:{
            type:[String],
            required:true
        },
        street:{
            type:String,
        },
        city:{
            type:String,
        },
        postal:{
            type:String,
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