class BlogsController {
  // [GET] /blog
  index(req, res) {
    res.render('blog');
  }
  //[GET] /blog/:slug
  show(req, res) {
    res.send('New detail');
  }
}

module.exports = new BlogsController();
