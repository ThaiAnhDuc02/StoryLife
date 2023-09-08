// @ts-nocheck
const Blog = require('../models/Blog')
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mutipleMongooseToObject')
class meController {
  // [GET] /blog
  async storedBlogs(req, res) {
    try {
      await Blog.find({})
      .then(blogs => {
        res.render('stored/blogs', {
          blogs: multipleMongooseToObject(blogs)
        })
      })
    } catch (error) {
      console.log("ERROR!!!")
    }
  }
}

module.exports = new meController();