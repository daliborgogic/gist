const { parse } = require('url')
const { exists, statSync, readFile } = require('fs')
const path = require('path')
const { send } = require('micro')
const mime = require('mime')
const fetch = require('node-fetch')
const lru = require('./lib/lru')
const data = require('./lib/data')
const { github } = require('./lib/github')
const { doctype, h, css, content, script } = require('./lib/include')

const { GIST_ID, USERNAME, TOKEN } = process.env

const headers = {
  'User-Agent': USERNAME,
  'Authorization': 'Basic ' + Buffer.from(USERNAME + ':' + TOKEN).toString('base64')
}

let user

let cache = lru(1000)

module.exports = async (req, res) => {
  try {
     if (!cache.has('user')) {
      console.log('MISS')
      let [setUser] = await Promise.all([
        await github('/user')
      ])

      user = setUser

      cache.set('user', setUser)
    } else {
      console.log('HIT')
      user = cache.get('user')
    }

    let { head, manifest, schema } = data
    let { title, description } = head

    const prepareHead = h(title, description, schema)
    const prepareContent = content(user)

    const html = doctype + prepareHead + css.replace(/\s+/g, ' ') + prepareContent + `<script src="/dist/main.js"></script><script>
    if ('serviceWorker' in navigator) {
      // navigator.serviceWorker.register('sw.js')
    }
  </script>`

    const parseUrl = parse(req.url)
    let file = `.${parseUrl.pathname}`
    exists(file, exist => {
      if (!exist) {
        send(res, 404)
        return
      }

      if (statSync(file).isDirectory()) {
        res.setHeader('Content-type', 'text/html; charset=utf-8')
        send(res, 200, html)
        return
      }

      readFile(file, (err, data) => {
        if (err) {
          send(res, 500)
        } else {
          res.setHeader('Content-type', mime.getType(file))
          send(res, 200, data)
        }
      })
    })
  } catch (error) {
    console.error(error)
  }
}
