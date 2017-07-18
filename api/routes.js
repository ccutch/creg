const { router, get, post, put, del } = require('microrouter')
const handlers = require('./handlers')

const routeNotFound = () => {
  let err = new Error('Route not found')
  err.statusCode = 404
  throw err
}

const routes = router(
  get('/', handlers.landing),
  put('/upload/:name', handlers.uploadComponent),
  get('/component/:identity', handlers.lookupComponent),

  get('/*',  routeNotFound),
  post('/*', routeNotFound),
  put('/*',  routeNotFound),
  del('/*',  routeNotFound)
)

module.exports = routes