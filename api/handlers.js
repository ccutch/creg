const registry = require('../modules/registry')
const fileio = require('../modules/file-io')
const { json, text } = require('micro')


exports.landing = (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.end(`
  <pre>
    Welcome to a my component registry.

    please refer to <a href='https://github.com/ccutch/creg'>the repository</a> for instructions.
  </pre>
  `)
}


exports.uploadComponent = async (req, res) => {
  let { name } = req.params
  let data = null

  console.log(req.headers)
  try {
    data = await json(req)
    console.log('was json')
  } catch(err) {
    console.log(err)
    data = await text(req)
  }
  console.log(data)

  return await registry.registerComponent(name, data)
}


exports.lookupComponent = async (req, res) => {
  let { identity } = req.params
  let component = registry.componentsByHash()[identity]
  if (component == null) {
    component = registry.componentsByName()[identity]
  }

  if (component == null) {
    const err = new Error(`Component: ${identity} not found`)
    err.statusCode = 404
    throw err
  }

  return {
    name: component.name,
    hash: component.hash,
    createDate: component.createDate,
    data: await fileio.loadComponent(component.hash)
  }
}