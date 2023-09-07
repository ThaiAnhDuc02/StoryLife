// @ts-nocheck
const Blog = require('../models/Blog');
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mutipleMongooseToObject')
class BlogsController {
  // [GET] /blog
  async index(req, res) {
    try {
      await Blog.find({})
        .then(blogs => {
          res.render('blog', { blogs: multipleMongooseToObject(blogs) })
        })
    } catch (error) {
      res.status(400).json({ error: "Fail to get Course" });
    }
  }
  // [GET] /blog/:slug
  async show(req, res) {
    try {
      await Blog.findOne({ slug: req.params.slug }).exec()
        .then(blog => {
          res.render('blog/detail', { blog: mongooseToObject(blog) })
        })
    } catch (error) {
      console.log("ERROR!!!")
    }
  }
  // [GET] /blog/create
  async create(req, res) {
    try {
      res.render('blog/create')
    } catch (error) {
      console.log("ERROR!!!")
    }
  }
  // [POST] /blog/store
  async store(req, res) {
    try {
      const blog = new Blog(req.body)
      blog.save()
        .then(() => res.redirect('/'))
    } catch (error) {
      console.log("ERROR!!!")
    }
  }
  // [GET] /blog/store
  async edit(req, res) {
    try {
      await Blog.findById(req.params.id)
        .then(blog => {
          res.render('blog/edit', {
            blog: mongooseToObject(blog)
          })
        })
    } catch (error) {
      console.log("ERROR!!!")
    }
  }
  // [PUT] /blog/:id
  async update(req, res) {
    try {
      await Blog.updateOne({ _id: req.params.id }, req.body)
        .then(() => res.redirect('/me/stored/blogs'))
    } catch (error) {
      console.log("ERROR!!!")
    }
  }
  // [DELETE] /blog/:id
  async delete(req, res) {
    try {
      await Blog.deleteOne({ _id: req.params.id })
        .then(() => res.redirect('back'))
    } catch (error) {
      console.log("ERROR!!!")
    }
  }
}

module.exports = new BlogsController();