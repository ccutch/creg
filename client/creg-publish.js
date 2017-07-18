const minimist = require('minimist')
const { exists } = require('fs.promised')
const { resolve } = require('path')
const fetch = require('node-fetch')
const path = require('path')

const fileio = require('../modules/file-io')


const args = minimist(process.argv, {
  string:  ['host', 'name'],
  boolean: ['help'],
  alias: {
    h: 'host'
  },
  default: {
    host: 'http://127.0.0.1:3000'
  }
})

const printHelp = () => `
Publish on CREG:

Usage:
  creg publish [options] <file | directory>

Options:
  help                    print this message
  host [127.0.0.1:3000]   url of creg api server
  name [filename]         name of component
`

module.exports = publish = async () => {

  if (args.help) {
    printHelp()
    return 0
  }

  let source = args._[3]
  if (source == null) {
    console.log('No file or directory given.')
    return 1
  }

  source = resolve(source)
  if (!await exists(source)) {
    console.log(`Source file ${source} does not exist`)
    return 1
  }

  let name = args.name || path.basename(source, path.extname(source))
  let data = await fileio.loadComponent(source, true)
  let body = typeof data == 'object' ? JSON.stringify(data) : data
  let url = `${args.host}/upload/${name}`

  let res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: body })
  res = await res.json()
  
  console.log(`Component has been published at ${args.host}/component/${res.hash}`)
  return 0
}
