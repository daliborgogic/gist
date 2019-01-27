 const doctype = `<!doctype html><html lang="en">`

//  <link rel="preload" href="./node_modules/lit-html/lit-html.js" as="script" crossorigin="anonymous">
//  <link rel="preload" href="./node_modules/lit-html/directives/repeat.js" as="script" crossorigin="anonymous">
//  <link rel="preload" href="./node_modules/lit-html/lib/default-template-processor.js" as="script" crossorigin="anonymous">
//  <link rel="preload" href="./node_modules/lit-html/lib/template-result.js" as="script" crossorigin="anonymous">
//  <link rel="preload" href="./node_modules/lit-html/lib/directive.js" as="script" crossorigin="anonymous">
//  <link rel="preload" href="./node_modules/lit-html/lib/template-instance.js" as="script" crossorigin="anonymous">

 const h = (title, description, schema) => {
   return `<title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="manifest" href="https://dalibor.ams3.cdn.digitaloceanspaces.com/dlbr/manifest.json">
    <link rel="preconnect" href="https://dalibor.ams3.cdn.digitaloceanspaces.com">
    <link rel="shortcut icon" sizes="16x16" type="image/png" href="https://dalibor.ams3.cdn.digitaloceanspaces.com/dlbr/favicon-16x16.png">
    <link rel="shortcut icon" sizes="32x32" type="image/png" href="https://dalibor.ams3.cdn.digitaloceanspaces.com/dlbr/favicon-32x32.png">
    <meta name="theme-color" content="#ffffff">
    <meta name="twitter:card" value="summary_large_image">
    <meta property="og:image" content="https://dalibor.ams3.cdn.digitaloceanspaces.com/dlbr/summary_large_image.png">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="https://daliborgogic.com">
    <style>
      #skip a {  position:absolute;  left:-10000px;  top:auto;  width:1px;  height:1px;  overflow:hidden;  }
      #skip a:focus {  position:static;  width:auto;  height:auto;  }
    </style>
    <script type="application/ld+json">${JSON.stringify(schema)}</script>`
 }

 const css =
   `<style>
    :root {
      --sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
      --monospace: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
    }
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
        font-family: var(--sans-serif);
        font-size: 0.875rem;
        line-height: 1.5;
        color: #000;
        background-color: #fff;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
      }
      [tabindex="-1"]:focus { outline: none !important; }
      .wrapper { max-width: 512px; margin: 0 auto; padding: 0 16px; }
      pre {
        font-size: 13px;
        color: #c600ef;
        overflow-x: auto;
        /* white-space: pre-wrap; */
        font-family: var(--monospace);
      }
      ul {
        padding-left: 0;
        list-style: none;
      }
      li {
        display: flex;
        justify-content: space-between;
      }
      li:first-child {
        margin-bottom: 16px;
        color: #757575;
      }
    </style>`

const content = user =>
  `<div class="wrapper">
    <div id="skip"><a href="#app">skip to content</a></div>
    <h1>Dalibor Gogic</h1>
    <div id="app"></div>
  </div>`

 module.exports = { doctype, css, h, content }

 // <pre id="pre">${JSON.stringify(user, null, 2)}</pre>
