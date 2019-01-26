require('now-env')
const fetch = require('node-fetch')
const lru = require('./lib/lru')

const headers = {
  'User-Agent': 'daliborgogic',
  'Authorization': 'Basic ' + Buffer.from('daliborgogic:' + process.env.TOKEN).toString('base64')
}

const github = async (x = '') =>
  await (await fetch(`https://api.github.com${x}`, { headers })).json()

let user
let data
let cache = lru(100)

module.exports = async (reg, res) => {
  res.setHeader('content-type', 'text/html; charset=utf-8')

  try {
    if (!cache.has('data')) {
      let [u, d] = await Promise.all([
        await github('/user'),
        await github('/gists/a0b2956c0d9629ff750194ddc944a54d')
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
    let { title, description } = head

    const doctype = `<!doctype html><html lang="en">`
    const h =
     `<title>${title}</title>
      <meta name="description" content="${description}">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="manifest" href='data:application/manifest+json, ${JSON.stringify(manifest)}'>
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

      const ga = new GA('UA-29874917-4')
      ga.send('pageview', { dp: to.fullPath })
    </script>`

    const html = `${doctype}${h}${css.replace(/\s+/g, ' ')}${content}${script}`
    const minify = html.replace(/\>[\s ]+\</g, '><')
    // cache.clear()
    return minify
  } catch (error) {
    return { error: error.message }
  }
}
