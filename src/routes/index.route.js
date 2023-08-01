const blogsRouter = require('./blogs.route')
const siteRouter = require('./site.route')
function route(app) {
    app.get("/",siteRouter)
    app.get("/search",siteRouter)
    app.post("/search",siteRouter)
    app.use("/blog",blogsRouter)
    app.get("/post",siteRouter)
    app.get("/contact",siteRouter)
    app.post("/contact",siteRouter)
    
}

module.exports = route;