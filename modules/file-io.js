
const path = require('path')
const homedir = require('homedir')()
// Functions for writing
const { writeFile, mkdir, exists } = require('fs.promised')
// Functions for reading
const { readdir, readFile, stat } = require('fs.promised')

const cregroot = path.join(homedir, '.creg')
const compdir = path.join(cregroot, 'components')
const registryFile = path.join(cregroot, 'registry.csv')

exports.hasCregDir = async () => {
  return (await exists(cregroot)) &&
         (await exists(compdir))
}


exports.initCregDir = async () => {
  await mkdir(cregroot) 
  await mkdir(compdir)
}


exports.writeComponent = async (hash, data) => {
  let isDir = typeof data == 'object'
  let isFile = typeof data == 'string'

  if (isDir) {
    let root = path.join(compdir, hash)

    if (!await exists(root))
      await mkdir(root)

    for (let file in data) {
      await exports.writeComponent(path.join(hash, file), data[file])
    }
  } else if (isFile) {
    await writeFile(path.join(compdir, hash), data)
  }
}


exports.loadComponent = async hash => {
  let root = path.join(compdir, hash)
  let isDir = (await stat(root)).isDirectory()

  if (isDir) {
    let res = {}
    let files = await readdir(root)
    for (let file of files) {
      if (file !== '.DS_Store')
        res[file] = await exports.loadComponent(path.join(hash, file))
    }

    return res
  } else {
    return await readFile(root, 'utf-8')
  }
}


exports.writeRegistryFile = data => {
  return writeFile(registryFile, data)
}


exports.readRegistryFile = async () => {
  if (await exists(registryFile))
    return await readFile(registryFile, 'utf-8')

  return ''
}