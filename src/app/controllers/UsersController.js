// @ts-nocheck
const User = require("../models/User");
const {
    multipleMongooseToObject,
    mongooseToObject,
} = require("../../util/mutipleMongooseToObject");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

let refreshTokens = [];
let accessTokens = [];

const UsersController = {
    async user(req, res) {
        try {
            const user = await User.find({});
            // res.render('profile', {
            //     user: multipleMongooseToObject(user),
            // });
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).send("Lỗi khi truy vấn dữ liệu người dùng.");
        }
    },

    async register(req, res) {
        const { username, password } = req.body;

        //hash password
        const myPlaintextPassword = password;
        const saltRounds = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(myPlaintextPassword, saltRounds);
        try {
            const existingUser = await User.findOne({ username: username });

            if (existingUser) {
                return res.json("Valid Account");
            } else {
                await User.create({
                    username: username,
                    password: hashed,
                });
                res.redirect("/")
            }
        } catch (error) {
            console.error(error);
            res.status(500).json("ERR");
        }
    },



    //Generate Access Token
    generateAccessToken: (existingUser) => {
        return jwt.sign(
            {
                id: existingUser._id,
                isAdmin: existingUser.isAdmin,
                name: existingUser.name,
                avatar: existingUser.avatar
            },
            process.env.JWT_ACCESS_KEY,
            {
                expiresIn: "1h",
            }
        );
    },
    //Generate Fresh Token
    generateFreshToken: (existingUser) => {
        return jwt.sign(
            {
                id: existingUser._id,
                isAdmin: existingUser.isAdmin,
                name: existingUser.name,
                avatar: existingUser.avatar
            },
            process.env.JWT_FRESH_KEY,
            {
                expiresIn: "1d",
            }
        );
    },

    async login(req, res) {
        const { username, password } = req.body;
        try {
            // Find user by username
            const existingUser = await User.findOne({ username: username });
            if (!existingUser) {
                return res.status(404).json({ message: "User not found" });
            }
            console.log("User:", existingUser)
            // Compare passwords
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password" });
            }

            // Generate tokens
            const accessToken = UsersController.generateAccessToken(existingUser);
            const refreshToken = UsersController.generateFreshToken(existingUser);

            // Store tokens in arrays (make sure these arrays are correctly handled)
            accessTokens.push(accessToken);
            refreshTokens.push(refreshToken);

            // Set cookies
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            // Remove password from response
            const { password: userPassword, ...userWithoutPassword } = existingUser._doc;
            // Redirect after setting cookies
            res.redirect('/');

        } catch (error) {
            console.error(error);
            // Send error response
            res.status(500).json({ message: "Internal server error" });
        }
    },
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.id });
            res.status(200).json("Delete Succesfully");
        } catch (error) {
            res.status(404).json("Delete fail");
        }
    },
    async profile(req, res) {
        try {
            const accessToken = req.cookies["accessToken"]
            if (!accessToken) {
                return res.redirect('/login')
            }
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    res.status(403).json('Token is not valid')
                }
                User.findById({ _id: user.id })
                    .then(user => {
                        res.render('profile', {
                            user: mongooseToObject(user),
                        })
                    })
            })
        } catch (error) {
            res.status(404).json('token is not valid')
        }
    },

    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies["refreshToken"]
        if (!refreshToken) {
            return res.status(401).json("You are not authenticated")
        }
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json('Refresh token is not valid')
        }
        jwt.verify(refreshToken, process.env.JWT_FRESH_KEY, (err, user) => {
            refreshTokens = refreshTokens.filter(token => token !== refreshToken)
            const newAccessToken = UsersController.generateAccessToken(user);
            const newRefreshToken = UsersController.generateFreshToken(user);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: "strict"
            });
            res.status(200).json({ accessToken: newAccessToken })
        })
    },

    userLogout: async (req, res) => {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        accessTokens = accessTokens.filter(token => token != req.cookies.accessToken)
        refreshTokens = refreshTokens.filter(token => token != req.cookies.refreshToken)
        res.status(200).json("Logged out !!!")
    },

}

module.exports = UsersController;
