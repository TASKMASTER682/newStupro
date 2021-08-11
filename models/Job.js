const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            min: 3,
            max: 160,
            required: true
        },
        forSlug:{
            type:String,
            
        },
        slug: {
            type: String,
            unique: true,
            index: true
        },
        
        status:{
            type:String,
            default:'job'
        },
        body: {
            type: {},
            required: true,
            min: 100,
            max: 2000000
        },
        subtitle: {
            type: String
        },
        desc:{
            type:String
        },
        officialLink:{
            type:String
        },

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

      
    downloadLink:[{
          linkName:{
              type:String,

          },
          link:{
              type:String
          }
        
        }],
    
      
        photo:{
            data: Buffer,
            contentType: String
        },
        jobCategories: [{ type: ObjectId, ref: 'JobCategory', required: true }],
        jobTags: [{ type: ObjectId, ref: 'JobTag', required: true }],
      
    },
    
    { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);