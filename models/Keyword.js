const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KeywordSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    repeat:{
        type:Number,
        default:0,
        required:true
    },
    used:{
        type:Boolean,
        default:false,
        required: true
    },
    used_for_keyword:{
        type:Boolean,
        default:false,
        required: true,
    },
    created_at:{
        type:Date,
        required:true,
        default:Date.now,
    },
    updated_at:{
        type:Date,
        required:true,
        default:Date.now,
    }   
});
module.exports = mongoose.model('keyword', KeywordSchema );
// module.exports = {Keyword: mongoose.model('keyword', KeywordSchema )};
