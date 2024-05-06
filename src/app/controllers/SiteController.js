// @ts-nocheck
const { JsonWebTokenError } = require("jsonwebtoken");
const {
  multipleMongooseToObject,
  mongooseToObject,
} = require("../../util/mutipleMongooseToObject");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Blog = require("../models/Blog");
const mutipleMongooseToObject = require("../../util/mutipleMongooseToObject");
const Category = require("../models/Category");

const SiteController = {
  // [GET] /
  home: async (req, res) => {
    try {
      const accessToken = req.cookies["accessToken"]
      if (!accessToken) {
        return res.redirect('/login');
      }

      // Verify the access token
      const user = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
      // find User
      const userData = await User.findById(user.id);
      if (!userData) {
        return res.status(404).json('Not Founded user')
      }
      // Access token is valid, fetch the blogs
      const blogs = await Blog.find({});
      if (!blogs || blogs.length === 0) {
        return res.status(404).json('Blogs not available');
      }
      // Find author of blog by blog.author
      const blogsWithAuthors = await Promise.all(blogs.map(async (blog) => {
        console.log(blog.author)
        const author = await User.findById(blog.author);
        const { _id, name, avatar, username } = author;
        const category = await Category.findById(blog.category)
        return {
          ...blog._doc,
          author: { _id, name, avatar, username },
          category: mongooseToObject(category)
        };
      }));
      console.log("🚀 ~ file: SiteController.js:46 ~ blogsWithAuthors ~ blogsWithAuthors:", blogsWithAuthors)

      // console.log("🚀 ~ file: SiteController.js:49 ~ dataBlogs ~ dataBlogs:", dataBlogs)
      // reSetUp the field of object
      const { _id, ...other } = userData._doc
      const userInfoIntro = {
        id: _id,
        ...other
      }
      res.render('index', { user: mongooseToObject(userInfoIntro), blogs: multipleMongooseToObject(blogsWithAuthors) });

    } catch (error) {
      if (jwt.TokenExpiredError) {
        return res.redirect('/login')
      }
      console.error(error);
      res.status(500).json(error)
    }
  },

  //[GET] /contact
  contact: async (req, res) => {
    try {
      const accessToken = req.cookies["accessToken"]
      if (!accessToken) {
        return res.redirect('/login')
      }
      if (!accessToken.includes(accessToken)) {
        return res.status(403).json('Refresh token is not valid')
      }
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          console.log(err);
        }
        console.log(user)
        res.render('contact', { user: user });
      })
    } catch (error) {
      res.status(404).json(error)
    }
  },

  //[GET] /post
  post: async (req, res) => {
    try {
      const accessToken = req.cookies["accessToken"]
      if (!accessToken) {
        return res.redirect('/login')
      }
      if (!accessToken.includes(accessToken)) {
        return res.status(403).json('Refresh token is not valid')
      }
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          console.log(err);
        }
        console.log(user)
        res.render('post', { user: user });
      })
    } catch (error) {
      res.status(404).json(error)
    }
  },
  //[Post] /searchResult
  search: async (req, res) => {
    try {
      const accessToken = req.cookies["accessToken"];
      if (!accessToken) {
        res.redirect('/login')
      }
      const user = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
      if (!user) {
        res.redirect('/login')
      }
      const dataUser = await User.findById({ _id: user.id })
      const searchTerm = req.query.q
      // Use a regular expression for case-insensitive search
      const blogs = await Blog.find({ title: { $regex: new RegExp(searchTerm, 'i') } });
      if (!blogs) {
        console.error(err);
        return res.status(500).send('Error occurred while searching for blog posts.');
      }

      // Find author of blog by blog.author
      const blogsWithAuthors = await Promise.all(blogs.map(async (blog) => {
        const author = await User.findById(blog.author); // Assuming blog.author contains author's ID
        const category = await Category.findById(blog.category)
        const { _id, name, avatar } = author;
        return {
          ...blog._doc,
          author: { _id, name, avatar },
          category: mongooseToObject(category)
        }
      }));
      console.log("🚀 ~ file: SiteController.js:137 ~ blogsWithAuthors ~ blogsWithAuthors:", blogsWithAuthors)
      // console.log(blogs);
      res.render('search', { user: mongooseToObject(dataUser), blogs: multipleMongooseToObject(blogsWithAuthors) });
    } catch (error) {
      res.status(404).json(error);
    }
  },
  // [GET] /register
  async register(req, res) {
    try {
      res.render('register')
    } catch (error) {
      console.log("ERROR!!!")
    }
  },
  // [GET] /login
  async login(req, res) {
    try {
      res.render('login')
    } catch (error) {
      console.log("ERROR!!!")
    }
  }
}

module.exports = SiteController;
