const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VariableSchema = new Schema({
    name:{
        type:String,
        required: true,
    },
    value:{
        type:String,
        default: "null"
    },
    isinteger:{
        type:Boolean,
        default:false
    },
    created_at:{
        type:Date,
        default: Date.now,
        required: true,
    },
    updated_at:{
        type:Date,
        required:true,
    }

    // is_running:{
    //     type:Boolean,
    //     default:false
    // },
    // current_keyword:{
    //     type:String,
    // },
    // current_total_count:{
    //     type:Number
    // },
    // current_total_pages:{
    //     type:Number
    // },
    // current_page:{
    //     type:Number
    // },
    // total_image_requests:{
    //     type:Number
    // },
    // total_image_decoded:{
    //     type:Number
    // },
    // total_image_write:{
    //     type:Number
    // },
    // total_image_ignored:{
    //     type:Number
    // },
    // total_image_updated:{
    //     type:Number
    // }
});
module.exports = mongoose.model('variables', VariableSchema );
// module.exports = {User: mongoose.model('user', UserSchema )};