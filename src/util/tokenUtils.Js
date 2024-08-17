const jwt = require('jsonwebtoken');
require('dotenv').config(); // Đảm bảo dotenv được cấu hình

function generateAccessToken(user) {
    return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = { generateAccessToken };
