import Vue from 'vue'
import Dlbr from './App.vue'

new Vue({
  el: '#app',
  render: h => h(Dlbr)
})

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
