const fetch = require('node-fetch')

const gist = async (username, id, file) =>
  await (await fetch(`https://gist.githubusercontent.com/${username}/${id}/raw/${file}`)).json()

module.exports = async (reg, res) => {
  try {
    return await gist('daliborgogic', 'a0b2956c0d9629ff750194ddc944a54d', 'data.json')
  } catch (error) {
    return { error: error.message }
  }
}
