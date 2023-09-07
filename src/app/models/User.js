const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  name: { type: String, require: true },
  age: { type: String, min: 1, require: true },
  avatar: { type: String, require: true },
  job: { type: String, },
  facebook:{type: String},
  instagram:{type: String},
  github:{type: String},
  address:{type: String},
  phone:{type: String},
  description:{type: String}
});

module.exports = mongoose.model('User', User);