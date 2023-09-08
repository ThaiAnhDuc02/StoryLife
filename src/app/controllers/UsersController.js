const User = require('../models/User')
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mutipleMongooseToObject')

class UsersController {
    async user(req, res) {
        try {
            await User.find({})
            .then(user => {
                res.render('profile',{
                    user: multipleMongooseToObject(user)
                })
            })
        } catch (error) {
            console.log(error)
        }
    }
    
}
module.exports = new UsersController()