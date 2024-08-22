const mongoose = require('mongoose');
require('dotenv').config();

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connect successfully');
    } catch (error) {
        console.error('Connect failure', error);
    }
}

module.exports = { connect };
