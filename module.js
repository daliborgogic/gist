import { html, render } from './node_modules/lit-html/lit-html.js'
import { repeat } from './node_modules/lit-html/directives/repeat.js'

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

let data = []
window.addEventListener('load', () => {

  const t = performance.getEntriesByType("navigation")[0]
  // Log performance details:
  for (const key of [
    'redirectStart',
    'redirectEnd',
    'fetchStart',
    'domainLookupStart',
    'domainLookupEnd',
    'connectStart',
    'connectEnd',
    'secureConnectionStart',
    'requestStart',
    'responseStart',
    'responseEnd',
    'domInteractive',
    'domContentLoadedEventStart',
    'domContentLoadedEventEnd',
    'domComplete'
  ])

  data.push({ key, value: (t[key] - t.startTime).toFixed(2) })

  const todo = items => {
    return html`
      <ul>
      <li>Timings <strong>ms</strong></li>
        ${repeat(
          items,
          item => html`
            <li>${item.key} <strong>${item.value}</strong></li>
          `
        )}
      </ul>
    `;
  };
  const el = document.querySelector('#container');
  render(todo(data), el)

  // Get Navigation Timing entries:
  // console.log(JSON.stringify(performance.getEntriesByType("navigation")[0], null, 2))

  // Get Resource Timing entries:
  // console.log(performance.getEntriesByType("resource"))
})
