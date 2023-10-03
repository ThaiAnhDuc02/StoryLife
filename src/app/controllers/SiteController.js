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
        return res.status(404).json('Not Founded ser')
      }
      // Access token is valid, fetch the blogs
      const blogs = await Blog.find({});
      if (!blogs || blogs.length === 0) {
        return res.status(404).json('Blogs not available');
      }
      // Find author of blog by blog.author
      const blogsWithAuthors = await Promise.all(blogs.map(async (blog) => {
        console.log(blog.author)
        const author = await User.findById(blog.author); // Assuming blog.author contains author's ID
        return { ...blog, author: author ? author : null };
      }));

      // set up data of blog 
      const dataBlogs = blogsWithAuthors.map(blog => {
        // Extract only necessary fields from the blog and author objects
        const { _id, name, avatar } = blog.author;
        return {
          ...blog._doc,
          author: blog.author ? { _id, name, avatar } : null
        };
      });
      // reSetUp the field of object
      const { _id, ...other } = userData._doc
      const userInfoIntro = {
        id: _id,
        ...other
      }
      res.render('index', { user: mongooseToObject(userInfoIntro), blogs: multipleMongooseToObject(dataBlogs) });

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
  search(req, res) {
    console.log(req.body);
    res.render('searchResult');
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
