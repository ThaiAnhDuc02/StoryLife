const express = require('express');
const router = express.Router();

const usersController = require('../app/controllers/UsersController')
const middlewareController = require('../app/controllers/middlewareController')

router.delete('/:id', middlewareController.verifyTokenAndAdminAuth, usersController.deleteUser)
router.get('/profile/:id', usersController.profile)
router.post('/refresh', usersController.requestRefreshToken)
router.post('/logout',middlewareController.verifyToken,usersController.userLogout)

router.get('/', middlewareController.verifyToken, usersController.user)

module.exports = router;