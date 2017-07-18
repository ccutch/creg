const { router, get, put } = require('microrouter')
const handlers = require('./handlers')

const routes = router(
  get('/', handlers.landing),
  put('/upload/:name', handlers.uploadComponent),
  get('/component/:identity', handlers.lookupComponent)
)

module.exports = routes