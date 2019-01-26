const { readFile } = require('fs')

const read = (path, opts = 'utf8') =>
  new Promise((resolve, reject) => {
    readFile(path, opts, (error, data) => {
      if (error) reject(error)
      else resolve(data)
    })
  })

module.exports = { read }
