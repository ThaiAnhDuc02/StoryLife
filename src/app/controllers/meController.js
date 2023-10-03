// @ts-nocheck
const Blog = require('../models/Blog');
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mutipleMongooseToObject');
const jwt = require('jsonwebtoken');

const meController = {
  // [GET] /blog
  storedBlogs: async (req, res) => {
    try {
      const accessToken = req.cookies["accessToken"];
      if (!accessToken) {
        return res.redirect('/login');
      }

      let user;
      try {
        user = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
      } catch (error) {
        console.error("Error verifying access token:", error);
        return res.redirect('/login');
      }

      // Find dataBlogs
      const dataBlogs = await Blog.find({ author: user.id });
      return res.render('stored/blogs', {
        blogs: multipleMongooseToObject(dataBlogs),
        user: user
      });

    } catch (error) {
      console.error("Error:", error);
      return res.redirect('/login'); // Redirect to login page in case of an error
    }
  }
};

module.exports = meController;
