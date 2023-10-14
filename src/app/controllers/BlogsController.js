// @ts-nocheck
const Blog = require('../models/Blog');
const Category = require('../models/Category')
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mutipleMongooseToObject')
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const BlogsController = {

  index: async (req, res) => {
    try {
      const accessToken = req.cookies["accessToken"];
      if (!accessToken) {
        return res.redirect('/login');
      }

      // Verify the access token
      const userToken = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
      //Find user
      const userData = await User.findById(userToken.id);
      if (!userData) {
        return res.status(404).json('Not Founded ser');
      }
      // reSetUp the field of userInfo
      const { _id, ...other } = userData._doc;
      const userInfoIntro = {
        id: _id,
        ...other
      };
      // Access token is valid, fetch the blogs
      const blogs = await Blog.find({}).limit(6);
      if (!blogs || blogs.length === 0) {
        return res.status(404).json('Blogs not available');
      }

      // Find author of blog 
      const blogsWithAuthors = await Promise.all(blogs.map(async (blog) => {
        const author = await User.findById(blog.author);
        // get field necessary of author;
        const { _id, name, avatar } = author;
        const category = await Category.findById(blog.category);
        return {
          ...blog._doc,
          author: { _id, name, avatar },
          category: mongooseToObject(category)
        };
      }));
      //Find Latest Posts
      const lastBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(3);
      //render
      res.render('blog', {
        user: mongooseToObject(userInfoIntro),
        blogs: multipleMongooseToObject(blogsWithAuthors),
        lastBlogs: multipleMongooseToObject(lastBlogs)
      });

    } catch (error) {
      console.log(error);
      if (jwt.JsonWebTokenError) {
        return res.redirect('/login');
      }
      res.status(400).json({ error: "Failed to get Course" });

    }
  },


  // [GET] /blog/:slug
  async show(req, res) {
    try {
      const accessToken = req.cookies["accessToken"];
      if (!accessToken) {
        return res.redirect('/login');
      }
      const user = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY)
      if (!user) {
        console.log(err);
        return res.status(403).json('Access token is not valid');
      }
      // Access token is valid, fetch the blogs
      const blog = await Blog.findOne({ slug: req.params.slug }).exec()
      if (!blog) {
        return res.sendStatus(404);
      }
      const category = await Category.findById(blog.category)
      const dataBlog = {
        ...blog._doc,
        category:mongooseToObject(category)
      }
      console.log(dataBlog)
      return res.render('blog/detail', {
        user: mongooseToObject(user), blog: mongooseToObject(dataBlog)
      })}
    catch (error) {
      console.log("ERROR!!!")
    }
  },


  // [GET] /blog/create
  create: async (req, res) => {
    try {
      const accessToken = req.cookies["accessToken"];
      if (!accessToken) {
        return res.redirect('/login');
      }
      const user = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY)
      if (!user) {
        return res.status(403).json('Access token is not valid');
      }
      const category = await Category.find({})
      if (!category) {
        return res.status(404).json('The category is not valid')
      }
      // Access token is valid, fetch the blogs
      res.render('blog/create', { user: user, category: multipleMongooseToObject(category) })
    } catch (error) {
      console.log("ERROR!!!")
    }
  },


  // [POST] /blog/create
  async store(req, res) {
    try {
      const accessToken = req.cookies["accessToken"];
      if (!accessToken) {
        return res.redirect('/login');
      }
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          console.log(err);
          return res.status(403).json('Access token is not valid');
        }
        req.body.author = user.id;
        const blog = new Blog(req.body)
        blog.save()
          .then(() => res.redirect('/'))
      });
    } catch (error) {
      console.log("ERROR!!!")
    }
  },

  // [GET] /blog/edit
  edit: async (req, res) => {
    try {
      const accessToken = req.cookies["accessToken"];
      if (!accessToken) {
        return res.redirect('/login');
      }
      const user = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
      if (!user) {
        console.log(err);
        return res.status(403).json('Access token is not valid');
      }
      // Access token is valid, fetch the blogs
      const blog = await Blog.findById(req.params.id)
      if (!blog) {
        return res.sendStatus(501)
      }
      const category = await Category.find({})
      const dataBlogEdit = {
        ...blog._doc,
        categories: multipleMongooseToObject(category)
      }
      res.render('blog/edit', {
        blog: (dataBlogEdit),
        user: user,
      })
    } catch (error) {
      res.status(404).json(error)
    }
  },


  // [PUT] /blog/:id
  async update(req, res) {
    try {
      await Blog.updateOne({ _id: req.params.id }, req.body)
        .then(() => res.redirect('/me/stored/blogs'))
    } catch (error) {
      console.log("ERROR!!!")
    }
  },
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

module.exports = BlogsController;