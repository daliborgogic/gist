const fetch = require('node-fetch')

/*
{
  "current_user_url": "/user",
  "authorizations_url": "/authorizations",
  "code_search_url": "/search/code?q={query}{&page,per_page,sort,order}",
  "commit_search_url": "/search/commits?q={query}{&page,per_page,sort,order}",
  "emails_url": "/user/emails",
  "emojis_url": "/emojis",
  "events_url": "/events",
  "feeds_url": "/feeds",
  "followers_url": "/user/followers",
  "following_url": "/user/following{/target}",
  "gists_url": "/gists{/gist_id}",
  "hub_url": "/hub",
  "issue_search_url": "/search/issues?q={query}{&page,per_page,sort,order}",
  "issues_url": "/issues",
  "keys_url": "/user/keys",
  "notifications_url": "/notifications",
  "organization_repositories_url": "/orgs/{org}/repos{?type,page,per_page,sort}",
  "organization_url": "/orgs/{org}",
  "public_gists_url": "/gists/public",
  "rate_limit_url": "/rate_limit",
  "repository_url": "/repos/{owner}/{repo}",
  "repository_search_url": "/search/repositories?q={query}{&page,per_page,sort,order}",
  "current_user_repositories_url": "/user/repos{?type,page,per_page,sort}",
  "starred_url": "/user/starred{/owner}{/repo}",
  "starred_gists_url": "/gists/starred",
  "team_url": "/teams",
  "user_url": "/users/{user}",
  "user_organizations_url": "/user/orgs",
  "user_repositories_url": "/users/{user}/repos{?type,page,per_page,sort}",
  "user_search_url": "/search/users?q={query}{&page,per_page,sort,order}"
}
*/

const github = async (x = '') =>
  await (await fetch(`https://api.github.com${x}`)).json()

const gist = async (username, id, file) =>
  await (await fetch(`https://gist.githubusercontent.com/${username}/${id}/raw/${file}`)).json()

module.exports = async (reg, res) => {
  res.setHeader('content-type', 'text/html; charset=utf-8')

  try {
    const [user, data] = await Promise.all([
      await github('/users/daliborgogic'),
      await gist('daliborgogic', 'a0b2956c0d9629ff750194ddc944a54d', 'data.json')
    ])

    const { head, manifest, schema } = data
    const { title, description } = head

    const h =
     `<title>${title}</title>
      <meta name="description" content="${description}">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="manifest" href='data:application/manifest+json,${JSON.stringify(manifest)}'>
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
          padding: 0 0 0 0;
        }

      </style>`
    const content =
     `<pre>${JSON.stringify(user, null, 2)}</pre>`

    const html = `<!doctype html><html lang="en">${h}${css.replace(/\s+/g, ' ')}${content}`
    const minify = html.replace(/\>[\s ]+\</g, '><')

    return minify
  } catch (error) {
    return { error: error.message }
  }
}
