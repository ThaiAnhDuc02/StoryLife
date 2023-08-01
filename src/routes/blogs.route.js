const express = require('express');
const router = express.Router()
const blogsController = require('../app/controllers/BlogsController')

router.use('/:slug',blogsController.show)
router.use('/',blogsController.index)

module.exports = router