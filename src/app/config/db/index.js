<<<<<<< HEAD
const mongoose = require('mongoose');
require('dotenv').config();
=======
const mongoose = require('mongoose')
async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/blog');
        console.log('Connect successfully')
    }
    catch (error) {
        console.log('Connect failure')
    }
>>>>>>> 388116d7ab62be6ec3277889b74e15c52a350bc9

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
