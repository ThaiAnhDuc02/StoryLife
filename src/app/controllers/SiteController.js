class SiteController {
  // [GET] /
  home(req, res) {
    res.render('index');
  }
  //[POST] /contact
  contact(req, res) {
    console.log(req.body);
    res.render('contact');
  }
  //[GET] /post
  post(req, res) {
    res.render('post');
  }
  //[Post] /searchResult
  search(req, res) {
    console.log(req.body);
    res.render('searchResult');
  }


}

module.exports = new SiteController();
