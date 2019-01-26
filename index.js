require('now-env')
const fetch = require('node-fetch')
const lru = require('./lib/lru')
const { readFile } = require('fs')
const { parse } = require('url')

const { TOKEN, USERNAME, GIST_ID } = process.env

const read = (path, opts = 'utf8') =>
  new Promise((resolve, reject) => {
    readFile(path, opts, (error, data) => {
      if (error) reject(error)
      else resolve(data)
    })
  })

const headers = {
  'User-Agent': USERNAME,
  'Authorization': 'Basic ' + Buffer.from(USERNAME + ':' + TOKEN).toString('base64')
}

const github = async (x = '') =>
  await (await fetch(`https://api.github.com${x}`, { headers })).json()

let user
let data
let cache = lru(100)

module.exports = async (req, res) => {
  res.setHeader('content-type', 'text/html; charset=utf-8')

  try {
    if (!cache.has('data')) {
      console.log('MISS')
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
      console.log('HIT')
      user = cache.get('user')
      data = cache.get('data')
    }

    let { head, manifest, schema } = data
    let { title, description } = head

    const doctype = `<!doctype html><html lang="en">`
    const h =
     `<title>${title}</title>
      <meta name="description" content="${description}">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="manifest" href="https://dalibor.ams3.cdn.digitaloceanspaces.com/dlbr/manifest.json">
      <meta name="theme-color" content="#ffffff">
      <meta name="twitter:card" value="summary_large_image">
      <meta property="og:image" content="https://dalibor.ams3.cdn.digitaloceanspaces.com/dlbr/summary_large_image.png">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:url" content="https://daliborgogic.com">
      <script type="application/ld+json">${JSON.stringify(schema)}</script>`
    const css =
     `<style>
        html {
          font-family: sans-serif;
          line-height: 1.15;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
          -webkit-box-sizing: border-box;
                  box-sizing: border-box;
          font-size: 16px;
          -ms-overflow-style: scrollbar;
          -webkit-tap-highlight-color: transparent;
        }
        *,
        *::before,
        *::after {
          -webkit-box-sizing: inherit;
                  box-sizing: inherit;
        }
        @-ms-viewport { width: device-width; }
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-size: 1rem;
          line-height: 1.5;
          color: #000;
          background-color: #fff;
        }
        [tabindex="-1"]:focus { outline: none !important; }
        pre { overflow-x: auto; }
      </style>`
    const content =
     `<pre>${JSON.stringify(user, null, 2)}</pre>`
    const script =
    `<script>
      const KEY = 'ga:user'
      const UID = (localStorage[KEY] = localStorage[KEY] || Math.random() + '.' + Math.random())

      function encode(obj) {
        let k
        let str = 'https://www.google-analytics.com/collect?v=1'
        for (k in obj) {
          if (obj[k]) {
            str += '&'+k+'='+ encodeURIComponent(obj[k])
          }
        }
        return str
      }

      class GA {
        constructor(ua, opts = {}) {
          this.args = Object.assign({ tid: ua, cid: UID }, opts)
          this.send('pageview')
        }

        send(type, opts) {
          if (type === 'pageview' && !opts) {
            opts = { dl: location.href, dt: document.title }
          }
          let obj = Object.assign({ t: type }, this.args, opts, { z: Date.now() })
          new Image().src = encode(obj)
        }
      }

      new GA('UA-29874917-4')

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
      }
    </script>`

    const html = `${doctype}${h}${css.replace(/\s+/g, ' ')}${content}${script}`
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
