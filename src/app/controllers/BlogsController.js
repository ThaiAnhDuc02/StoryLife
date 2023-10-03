// @ts-nocheck
const Blog = require('../models/Blog');
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mutipleMongooseToObject')
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const BlogsController = {

  // [GET] /blog
  index: async (req, res) => {
    try {
      const accessToken = req.cookies["accessToken"];
      if (!accessToken) {
        return res.redirect('/login');
      }

      // Verify the access token
      const userToken = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY)
      //Find user
      const userData = await User.findById(userToken.id)
      if (!userData) {
        return res.status(404).json('Not Founded ser')
      }
      // reSetUp the field of userInfo
      const { _id, ...other } = userData._doc
      const userInfoIntro = {
        id: _id,
        ...other
      }


      // Access token is valid, fetch the blogs
      const blogs = await Blog.find({}).limit(6)
      if (!blogs || blogs.length === 0) {
        return res.status(404).json('Blogs not available');
      }
      // Find author of blog 
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
      
      //Find Latest Posts
      const lastBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(3);
      res.render('blog', { 
        user: mongooseToObject(userInfoIntro), 
        blogs: multipleMongooseToObject(dataBlogs),
        lastBlogs:multipleMongooseToObject(lastBlogs)
       });

    } catch (error) {
      console.log(error);
      if(jwt.JsonWebTokenError)
      {
        return res.redirect('/login')
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
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          console.log(err);
          return res.status(403).json('Access token is not valid');
        }

        // Access token is valid, fetch the blogs
        Blog.findOne({ slug: req.params.slug }).exec()
          .then(blog => {
            res.render('blog/detail', {
              blog: mongooseToObject(blog),
              user: user
            })
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({ error: "Failed to fetch blogs" });
          });
      });
    } catch (error) {
      console.log("ERROR!!!")
    }
  },


  // [GET] /blog/create
  async create(req, res) {
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
        // Access token is valid, fetch the blogs
        res.render('blog/create', { user: user })
      });

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
  async edit(req, res) {
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
        // Access token is valid, fetch the blogs
        Blog.findById(req.params.id)
          .then(blog => {
            console.log(typeof blog)
            res.render('blog/edit', {
              blog: mongooseToObject(blog),
              user: user
            })
          })
      });
    } catch (error) {
      console.log("ERROR!!!")
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