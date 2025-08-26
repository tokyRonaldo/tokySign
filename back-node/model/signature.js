const mongoose = require('mongoose');

const signatureSchema = mongoose.Schema({
    pdf_signed : {type:String,required : true},
    pdf_original : {type:String,required : true},
    file_name : {type:String,default : ''},
    sign : {type:String,default : null},
    user_id : {type : mongoose.Schema.Types.ObjectId,ref :'User' ,default : null}
},{
    timestamps : true
});

module.exports = mongoose.model('signature',signatureSchema)
