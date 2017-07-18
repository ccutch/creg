
const sha1 = require('sha1')
const { generateHash } = require('./utils')
const { writeComponent, readRegistryFile, writeRegistryFile } = require('./file-io')

const components = exports.components = new Set([])


class Component {
  constructor(hash, name, createDate) {
    this.hash = hash
    this.name = name
    this.createDate = createDate
  }

  toString() {
    return `Component<${this.hash}> ${this.name} -- ${this.createDate}`
  }
}


exports.registerComponent = async (name, data, createDate=Date.now(), hash=generateHash(data)) => {
  const component = new Component(hash, name, createDate)
  await writeComponent(hash, data)
  components.add(component)
  exports.saveRegistry() // not awaiting to run in background
  return component
}


exports.componentsByHash = () => [...components].reduce((state, c) => {
  state[c.hash] = c
  return state
}, {})


exports.componentsByName = () => [...components].reduce((state, c) => {
  if (state[c.name] != null && state[c.name].createDate > c.createDate) {
    return state
  }

  state[c.name] = c
  return state
}, {})


exports.saveRegistry = async () => {
  let data = ''
  for (let component of components) {
    data += `${component.hash},${component.name},${component.createDate}\n`
  }
  await writeRegistryFile(data)
}


exports.loadRegistry = async () => {
  let data = await readRegistryFile()
  for (let line of data.split('\n')) {
    if (line == '') continue
    let [hash, name, createDate] = line.split(',')
    components.add(new Component(hash, name, Number(createDate)))
  }
  return components
}