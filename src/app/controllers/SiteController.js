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
  // [GET] /register
  async register(req, res) {
    try {
      res.render('register')
    } catch (error) {
      console.log("ERROR!!!")
    }
  }
    // [GET] /login
  async login(req, res) {
    try {
      res.render('login')
    } catch (error) {
      console.log("ERROR!!!")
    }
  }


}

module.exports = new SiteController();
