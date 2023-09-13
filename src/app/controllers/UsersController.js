// @ts-nocheck
const User = require('../models/User');
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mutipleMongooseToObject');
const jwt = require('jsonwebtoken');

class UsersController {
    async user(req, res) {
        try {
            const user = await User.find({ _id: '64f9e557d72ba611614b550e' });
            res.render('profile', {
                user: multipleMongooseToObject(user),
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Lỗi khi truy vấn dữ liệu người dùng.');
        }
    }

    async register(req, res) {
        const { username, password } = req.body;
        try {
            const existingUser = await User.findOne({ username : username });

            if (existingUser) {
                return res.json('Tài khoản đã tồn tại');
            } else {
                await User.create({ username, password });
                res.json('Đăng ký thành công');
            }
        } catch (error) {
            console.error(error);
            res.status(500).json('Tạo tài khoản thất bại');
        }
    }
    async login(req, res) {
        const { username, password } = req.body;
        try {
            const existingUser = await User.findOne({ username, password });
            if (existingUser?.username === username && existingUser?.password === password) {
                const token = jwt.sign({ username: existingUser.username, id: existingUser._id }, existingUser.password, {
                    expiresIn: '1h', // Token expires in 1 hour
                  });
                  res.status(200).json({ token });
            } else {
                res.status(401).json({ message: 'Authentication failed' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json('Đăng nhập thất bại');
        }
    }
}

module.exports = new UsersController();
