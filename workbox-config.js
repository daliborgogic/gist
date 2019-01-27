module.exports = {
  cacheId: 'dlbr',
  globDirectory: 'dist/',
  clientsClaim: true,
  skipWaiting: true,
  directoryIndex: '/',
  globPatterns: ['**/*.js'],
  swDest: 'sw.js',
  modifyUrlPrefix: {
    '': '/dist/'
  },
  runtimeCaching: [
    {
      urlPattern: new RegExp('/dist/*'),
      handler: 'cacheFirst'
    },
    {
      urlPattern: new RegExp('/*'),
      handler: 'networkFirst'
    }
  ]
}
