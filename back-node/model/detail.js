const mongoose = require('mongoose');

const detailSchema = mongoose.Schema({
    titre : {type:String,required : true},
    nom : {type:String,required : true},
    email : {type:String,required : true},
    phone : {type:String,default : null},
    adresse : {type:String,default : null},
    signature_id : {type : mongoose.Schema.Types.ObjectId,ref :'signature' ,default : null}
});

module.exports = mongoose.model('detail',detailSchema)