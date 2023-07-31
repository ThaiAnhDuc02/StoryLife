// @ts-nocheck
const path = require('path')
const express = require('express')
const morgan = require('morgan')
const handlebars = require('express-handlebars')

const app = express()
const port = 5000

//Handle static file 
app.use(express.static(path.join(__dirname,'public')))

//Http logger
app.use(morgan('dev'))

//Template engine
app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));
console.log(path.join(__dirname, 'views'));

// route
app.get("/",(req,res) => {
    res.render('home')
})
app.get("/blog",(req,res) => {
    res.render('blog')
})

app.listen(port,() => console.log(`Running app at http://localhost:${port}`))