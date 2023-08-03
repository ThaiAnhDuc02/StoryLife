const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');
//post
router.use('/post', siteController.post);
//contact
router.get('/contact', siteController.contact);
router.post('/contact', siteController.contact);
//search
router.get('/search', siteController.search);
router.post('/search', siteController.search);
//home
router.get('/', siteController.home);

module.exports = router;
