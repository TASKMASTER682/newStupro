const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const materialSchema = new mongoose.Schema(
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
        forSlug:{
            type:String,
            required:true
        },
        body: {
            type: {},
            required: true,
            min: 50,
            max: 2000000
        },
        subtitle: {
            type: String
        },
        desc: {
            type:{}
        },
  
        photo: {
            data: Buffer,
            contentType: String
        },
        materialCategories: [{ type: ObjectId, ref: 'MaterialCategory', required: true }],
        postedBy: {
            type: ObjectId,
            ref: 'User'
        },
        mainCat:{
            type:String,
            required:true
        },
        subCat:{
            type:String,
            required:true
        },
        standard:{
            type:String,
            required:true
        },
        materialType:{
            type:String,
            required:true
        },
        downloadLink:[{
          linkName:{
              type:String,

          },
          link:{
              type:String
          }
        
        }],
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
        ]
   
    },
    { timestamps: true }
    
);

module.exports = mongoose.model('Material', materialSchema);