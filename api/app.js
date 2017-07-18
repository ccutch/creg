const micro = require('micro')
const Enum = require('enum')
const { extendObservable, when } = require('mobx')

const routes = require('./routes')
const swarm = require('../modules/swarm')
const registry = require('../modules/registry')

const STATES = new Enum([
  'initializing',
  'seeding',
  'running',
  'crashed'
])


class App {

  constructor(port=3000) {

    this._port = port
    this._server = micro(routes)
    extendObservable(this, {
      state: null,
      error: null
    })

    when(
      () => this.error != null,
      () => this.state = STATES.crashed
    )

    when(
      () => this.state == STATES.initializing,
      () => console.log('Creating creg app')
    )

    when(
      () => this.state == STATES.seeding,
      () => console.log('Seeding app data from sister nodes.')
    )

    when(
      () => this.state == STATES.running,
      () => console.log(`Creg service is running at http://localhost:${this._port}`)
    )
  }

  async start(nodes=null) {

    this.state = STATES.initializing
    await registry.loadRegistry()

    if (nodes && Array.isArray(nodes)) {
      this.state = STATES.seeding
      await swarm.initializeNodes(nodes)
    }

    return this._server.listen(this._port, () => this.state = STATES.running)
  }
}

module.exports = App
if (require.main == module) {
  const app = new App()
  app.start()
}