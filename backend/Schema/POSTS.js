const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
   title:{
    type:String,
    maxLength:500
   },
   owner:{ type:mongoose.Schema.Types.ObjectId,ref:"USER",required:true },
   img:{type:String},
   likes:{
      type:[mongoose.Schema.Types.ObjectId],
      ref:"USER",
      default:[],
   },
   comment:[
    {   
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"USER",required:true},
    text:{type:String,required:true},
    }
   ]
},{timestamps:true})

module.exports=mongoose.model("POSTS",PostSchema)