importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js')

workbox.core.setCacheNameDetails({ prefix: 'dlbr' })

workbox.skipWaiting()
workbox.clientsClaim()

self.__precacheManifest = [
  {
    "url": "/",
    "revision": "8ec255948e87eaee719289c91a4ef8e9"
  }
].concat(self.__precacheManifest || [])
workbox.precaching.suppressWarnings()
workbox.precaching.precacheAndRoute(self.__precacheManifest, {
  "directoryIndex": "/"
})

workbox.routing.registerRoute(/\/.*/, workbox.strategies.networkFirst(), 'GET')
