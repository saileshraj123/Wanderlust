const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

console.log(passportLocalMongoose);
console.log(typeof passportLocalMongoose);

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
});

userSchema.plugin(passportLocalMongoose);                     //generate automatically the username,salting and hashed password

module.exports=mongoose.model('User',userSchema);