const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    host_id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    repeat:{
        type:Number,
        required:true,
        default: 0
    },
    used:{
        type:Boolean,
        required:true,
        default:false
    },
    created_at:{
        type:Date,
        required:true,
        default:Date.now(),
    },
    updated_at:{
        type:Date,
        required:true,
        default:Date.now()
    }
});
module.exports = mongoose.model('user', UserSchema );
// module.exports = {User: mongoose.model('user', UserSchema )};
