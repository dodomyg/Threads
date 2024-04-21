const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    dp:{type:String,default:""},
    followers:{
        type:[mongoose.Schema.Types.ObjectId],
        default:[],
    },
    following:{
        type:[mongoose.Schema.Types.ObjectId],
        default:[],
    },
    bio:{type:String,default:""}
},{timestamps:true})

module.exports=mongoose.model("USER",UserSchema)