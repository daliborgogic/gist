require('now-env')

const fetch = require('node-fetch')

const { TOKEN, USERNAME } = process.env

const headers = {
  'User-Agent': USERNAME,
  'Authorization': 'Basic ' + Buffer.from(USERNAME + ':' + TOKEN).toString('base64')
}

const github = async (x = '') =>
  await (await fetch(`https://api.github.com${x}`, { headers })).json()

module.exports = { github, headers }
