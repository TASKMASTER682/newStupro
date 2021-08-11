const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const blogSchema = new mongoose.Schema(
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
            min: 200,
            max: 2000000
        },
        sutitle:{
            type:String
        },
        forSlug:{
            type:String
        },
        desc:{
            type:String
        },

        excerpt: {
            type: String,
            max: 1000
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

        photo: {
            data: Buffer,
            contentType: String
        },
        categories: [{ type: ObjectId, ref: 'Category', required: true }],
        tags: [{ type: ObjectId, ref: 'Tag', required: true }],
        postedBy: {
            type: ObjectId,
            ref: 'User'
        },

    },
    { timestamps: true }
    
);

module.exports = mongoose.model('Blog', blogSchema);