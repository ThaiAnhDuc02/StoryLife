// @ts-nocheck
const jwt = require("jsonwebtoken")

const User = require("../models/User")

const middlewareController = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token
        console.log("token", token)
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    res.redirect('/')
                }
                req.user = user;
                next()
            })
        }
        else{
            res.status(401).json("You are not authenticated");
        }
    },
    verifyTokenAndAdminAuth: (req,res,next) =>{
        middlewareController.verifyToken(req,res, () =>{
            if(req.user.id == req.params.id || req.user.isAdmin)
            {
                next();
            }
            else{
                res.status(403).json('You are not allow')
            }
        })
    }
}

module.exports = middlewareController;