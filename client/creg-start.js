const minimist = require('minimist')
const App = require('../api/app')


const args = minimist(process.argv, {
  string: ['node'],
  boolean: ['help'],
  alias: {
    h: 'help',
    n: 'node'
  },
  default: {
    port: 3000
  }
})

conts printHelpMessage = () => `
Start CREG API Server

Usage:
  creg start [options]

Options:
  port [3000]               Port for api server to be running on
  node (multiple accepted)  Sister nodes to seed from and sync with
`


module.exports = start = async () => {

  if (args.help) {
    printHelpMessage()
    return 0
  }

  if (typeof args.node == 'string')
    args.node = [args.node]

  let app = new App(args.port)
  app.start(args.node)
}