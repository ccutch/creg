
const fileio = require('../modules/file-io')


module.exports = init = async () => {

  if (!await fileio.hasCregDir()) {
    try {
      await fileio.initCregDir()
    } catch (error) {
      console.error(`Error occurred while initializing CREG: ${error.message}`)
      return 1
    }
  } else {
    console.log('You have already setup CREG at ~/.creg')
    return 1
  }

  return 0
}
