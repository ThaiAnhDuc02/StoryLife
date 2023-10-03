const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  username: { type: String, require: true },
  password: { type: String, require: true },
  name: { type: String, default: 'Người bí ẩn' },
  age: { type: String, default: null },
  avatar: { type: String, default: 'https://banner2.cleanpng.com/20180626/fhs/kisspng-avatar-user-computer-icons-software-developer-5b327cc98b5780.5684824215300354015708.jpg' },
  job: { type: String, default: null },
  facebook: { type: String, default: null },
  instagram: { type: String, default: null },
  github: { type: String, default: null },
  address: { type: String, default: null },
  phone: { type: String, default: null },
  description: { type: String, default: null },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('User', User);