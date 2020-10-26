const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KeywordSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    used:{
        type:String,
        default:false,
        required: true
    },
    created_at:{
        type:String,
        required:true,
        default:Date.now,
    },
    updated_at:{
        type:String,
        required:true,
        default:Date.now,
    }   
});
module.exports = mongoose.model('keyword', KeywordSchema );
// module.exports = {Keyword: mongoose.model('keyword', KeywordSchema )};
