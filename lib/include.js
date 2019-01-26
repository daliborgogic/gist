 const doctype = `<!doctype html><html lang="en">`

 const h = (title, description, schema) => {
   return `<title>${title}</title>
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
 }

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

 const content = user => `<pre>${JSON.stringify(user, null, 2)}</pre>`
 module.exports = { doctype, css, h, script, content }
