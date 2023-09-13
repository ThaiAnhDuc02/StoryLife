const blogsRouter = require('./blogs.route');
const siteRouter = require('./site.route');
const meRouter = require('./me.route')
const userRouter = require('./users.route')

function route(app) {
  app.get('/search', siteRouter);
  app.post('/search', siteRouter);
  app.use('/blog', blogsRouter);
  app.get('/post', siteRouter);
  app.get('/contact', siteRouter);
  app.post('/contact', siteRouter);
  app.use('/me',meRouter);
  app.use('/user',userRouter);
  app.use('/', siteRouter);
}

module.exports = route;
