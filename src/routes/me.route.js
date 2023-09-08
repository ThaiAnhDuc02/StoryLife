const express = require('express');
const router = express.Router();
const meController = require('../app/controllers/meController');

router.get('/stored/blogs', meController.storedBlogs);
module.exports = router;
