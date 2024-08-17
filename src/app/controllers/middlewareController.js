// @ts-nocheck
const jwt = require('jsonwebtoken');

const middlewareController = {
    verifyToken: (req, res, next) => {
        const authHeader = req.headers.authorization; // Thay đổi để lấy giá trị từ `authorization` header
        if (authHeader) {
            const token = authHeader.split(' ')[1]; // Tách token từ "Bearer [token]"
            jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json('Invalid token');
                }
                req.user = user;
                next();
            });
        } else {
            res.status(401).json('You are not authenticated');
        }
    },
    verifyTokenAndAdminAuth: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.id === req.params.id || req.user.isAdmin) {
                next();
            } else {
                res.status(403).json('You are not allowed');
            }
        });
    }
};

module.exports = middlewareController;
