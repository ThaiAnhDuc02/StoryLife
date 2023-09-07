const express = require('express');
const router = express.Router();

const usersController = require('../app/controllers/UsersController')

router.get('/',usersController.user)

module.exports = router;