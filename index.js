const fetch = require('node-fetch')

const gist = async (username, id, file) =>
  await (await fetch(`https://gist.githubusercontent.com/${username}/${id}/raw/${file}`)).json()

module.exports = async (reg, res) => {
  res.setHeader('content-type', 'text/html; charset=utf-8')
  try {
    const data = await gist('daliborgogic', 'a0b2956c0d9629ff750194ddc944a54d', 'data.json')

    const { head, manifest } = data
    const { title, description } = head

    const h =
     `<title>${title}</title>
      <meta name="description" content="${description}">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="manifest" href='data:application/manifest+json,${JSON.stringify(manifest)}' />`
    const content =
     `<pre>${manifest}</pre>`

    const d = `<!doctype html><html lang="en">${h}${content}`
    const minify = d.replace(/\>[\s ]+\</g, '><')

    return minify
  } catch (error) {
    return { error: error.message }
  }
}
