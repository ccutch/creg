const sha1 = require('sha1')


const generateHash = src => {
  if (typeof src == 'string') {
    return sha1(src)
  } else {
    let hashes = []
    for (let key in src) {
      hashes.push(generateHash(src[key]))
    }
    return sha1(hashes.join())
  }
}

exports.generateHash = generateHash