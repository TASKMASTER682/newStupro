const mongoose=require('mongoose');
const privateJobTagSchema=new mongoose.Schema({

    name:{
        type:String,
        trim:true,
        required:true,
        max:32,
        
    },
    slug:{
        type:String,
        max:32,
        unique:true,
        index:true,
        
    },
},
{timestamps:true}
);

module.exports=mongoose.model('PrivateJobTag',privateJobTagSchema);