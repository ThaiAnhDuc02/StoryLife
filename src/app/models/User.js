const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  username: {type: String, require:true},
  password:{ type :String, require: true},
  name: { type: String, default: null},
  age: { type: String, default:null},
  avatar: { type: String, },
  job: { type: String,default:null },
  facebook:{type: String,default:null},
  instagram:{type: String,default:null},
  github:{type: String,default:null},
  address:{type: String,default:null},
  phone:{type: String,default:null},
  description:{type: String,default:null}
});

module.exports = mongoose.model('User', User);