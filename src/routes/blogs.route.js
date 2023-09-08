const express = require('express');
const router = express.Router();
const blogsController = require('../app/controllers/BlogsController');


router.get('/create', blogsController.create);
router.post('/store', blogsController.store);
router.get('/:slug', blogsController.show);
router.get('/:id/edit', blogsController.edit);
router.put('/:id', blogsController.update);
router.delete('/:id', blogsController.delete);
router.get('/', blogsController.index);

module.exports = router;
