const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Blog = new Schema({
  title: { type: String, require: true },
  content: { type: String, min: 1, require: true },
  image_cover: { type: String, require: true },
  images: { type: Array, default: null },
  views: { type: Number, default: 0 },
  category: { type: String, },
  author:{type:String},
  slug: { type: String, slug: "title", unique: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', Blog);