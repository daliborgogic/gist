require('now-env')

const fetch = require('node-fetch')
const lru = require('./lib/lru')
const { read } = require('./lib/fs')
const { parse } = require('url')
const { github } = require('./lib/github')
const { doctype, h, css, content, script } = require('./lib/include')
const { exists } = require('fs')

const { GIST_ID,USERNAME, TOKEN } = process.env

const headers = {
  'User-Agent': USERNAME,
  'Authorization': 'Basic ' + Buffer.from(USERNAME + ':' + TOKEN).toString('base64')
}

let user
let data
let cache = lru(1000)

module.exports = async (req, res) => {
  res.setHeader('content-type', 'text/html; charset=utf-8')

  try {
    if (!cache.has('data')) {
      let [setUser, gist] = await Promise.all([
        await github('/user'),
        await github('/gists/' + GIST_ID)
      ])


      console.log('GIST ', process.env.GIST_ID)
      const files = await (await fetch(gist.files['data.json'].raw_url, { headers })).json()
      user = setUser
      data = files

      cache.set('user', setUser)
      cache.set('data', files)
    } else {
      user = cache.get('user')
      data = cache.get('data')
    }

    let { head, manifest, schema } = data
    let { title, description } = head

    const prepareHead = h(title, description, schema)
    const prepareContent = content(user)

    const html = doctype + prepareHead + css.replace(/\s+/g, ' ') + prepareContent + '<script defer type="module" src="./module.js"></script>'

    const minify = html.replace(/\>[\s ]+\</g, '><')

    const parseUrl = parse(req.url)
    const { pathname } = parseUrl

    console.log(pathname)
    if (pathname === '/clear') {
      cache.clear()

      return 'clear'
    } else if (pathname === '/') {
      return minify
    } else {
      try {
        const file = await read(`.${pathname}`)
        res.setHeader('Content-type', 'application/javascript')
        res.statusCode = 200
        return file
      } catch (error) {
        res.statusCode = 500
        return
      }
    }

  } catch (error) {
    console.log(error)
    return { error: error.message }
  }
}
