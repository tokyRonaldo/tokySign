const mongoose= require('mongoose');

const userSchema= mongoose.Schema({
    email :{type:String,required:true},
    username:{type:String,required:true},
    password:{type:String}
},{
    timestamp:true
})

module.exports=mongoose.model('user',userSchema);