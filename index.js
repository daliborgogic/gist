require('now-env')

const fetch = require('node-fetch')
const lru = require('./lib/lru')
const { read } = require('./lib/fs')
const { parse } = require('url')
const { github } = require('./lib/github')
const { doctype, h, css, content } = require('./lib/include')

const { GIST_ID } = process.env

let user
let data
let cache = lru(100)

module.exports = async (req, res) => {
  res.setHeader('content-type', 'text/html; charset=utf-8')

  try {
    if (!cache.has('data')) {
      let [u, d] = await Promise.all([
        await github('/user'),
        await github('/gists/' + GIST_ID)
      ])

      const f = await (await fetch(d.files['data.json'].raw_url)).json()
      user = u
      data = f

      cache.set('user', u)
      cache.set('data', f)
    } else {
      user = cache.get('user')
      data = cache.get('data')
    }

    let { head, manifest, schema } = data
    let { title, description, script } = head

    const prepareHead = h(title, description, schema)
    const prepareContent = content(user)

    const html = doctype + prepareHead + css.replace(/\s+/g, ' ') + prepareContent + script

    const minify = html.replace(/\>[\s ]+\</g, '><')

    const parseUrl = parse(req.url)
    const { pathname } = parseUrl

    if (pathname === '/sw.js') {
       const sw = await read('./sw.js')
      res.setHeader('Content-type', 'application/javascript')

      return sw
    } else if (pathname === '/clear') {
      cache.clear()

      return 'clear'
    } else {
      return minify
    }

  } catch (error) {
    return { error: error.message }
  }
}
