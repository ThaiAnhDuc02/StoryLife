const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');
const usersController = require('../app/controllers/UsersController')
const middlewareController = require('../app/controllers/middlewareController')
//post
router.use('/post', siteController.post);
//contact
router.get('/contact', siteController.contact);
router.post('/contact', siteController.contact);
//search
router.get('/search', siteController.search);
router.post('/search', siteController.search);
//register
router.get('/register',siteController.register)
router.post('/register',usersController.register)
//login
router.post('/login',usersController.login)
router.get('/login',siteController.login)
//logout
router.post('/logout',middlewareController.verifyToken,usersController.userLogout)

//home
router.get('/', siteController.home);

module.exports = router;
