/* eslint-env node */

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

/*
 * Generates documentation page for clients from
 *
 * - Client's API.md
 * - Client's installed core's README.md
 * - Client's installed plugin's README.md
 *
 * The documentation will be saved to `/docs` within the client. You should no
 * longer publish a client's API.md, as it will be included twice. (Generated
 * docs and .md.)
 *
 * Call like `node ./scripts/makeDocs.js ./path/to/client`.
 */

// IMPORTS
const fs = require('fs')
const path = require('path')
const markdownIt = require('markdown-it')()

// SETUP
const fsOptions = { encoding: 'utf8' }
const clientPath = process.argv[2]
const docPath = `${clientPath}/docs`
const polarDependencyPathsBase = `${clientPath}/node_modules/@polar`
const cssFiles = [
  'github-markdown.css',
  'github-markdown-light.css',
  'github-markdown-dark.css',
]

/**
 * HTMLifies and styles a markdown file.
 * @param {string} filePath path to markdown source file
 * @param {string[]} [children] files to link to at end of document
 * @returns {string} html document
 */
function toHtml(filePath, children) {
  const clientText = fs.readFileSync(filePath, fsOptions)
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
  <title>🧊📚 POLAR Documentation</title>
	<link rel="stylesheet" href="./github-markdown.css">
  <style>
    body {
      box-sizing: border-box;
      min-width: 200px;
      max-width: 980px;
      margin: 0 auto;
      padding: 45px;
    }
    @media (prefers-color-scheme: dark) {
      html {
        background-color: #0d1117;
      }
    }
  </style>
</head>
<body>
  <article class="markdown-body">
    ${markdownIt.render(clientText)}
    ${
      children
        ? `<h2>Child documents</h2><nav><ul>
      ${children
        .map(
          (fileName) =>
            `<li><a href="${fileName}" target="_blank">${fileName}</a></li>`
        )
        .join('')}
      </ul></nav>`
        : ''
    }
  </article>
  <hr>
  <a href="https://github.com/Dataport/polar/blob/main/LEGALNOTICE.md" style="font-family: sans-serif;">Legal Notice (Impressum)</a>
</body>
</html>`
}

/**
 * Removes documentation page link from documentation page; it's only relevant
 * when reading the API.md directly, not on this page.
 * @param {string} html the html'd API.md
 * @returns {string} html without the link to itself
 */
const filter = (html) => {
  const filterRegex =
    /<p>For all additional details, check the <a href=".*">full documentation<\/a>.<\/p>/g

  const matches = (html.match(filterRegex) || []).length

  if (matches !== 1) {
    console.error(html)

    throw new Error(
      `makeDocs.js expected to remove a self-reference in HTML generated from an API.md with exactly one match, but found ${matches} matches. This indicates an unexpected change in the API.md.`
    )
  }

  return html.replace(filterRegex, '')
}

const getDistinguishingFileNameFromPath = (path) => path.split('/').slice(-1)[0]

const dependencyPaths = fs
  .readdirSync(polarDependencyPathsBase, { ...fsOptions, withFileTypes: true })
  .filter((dirent) => dirent.isSymbolicLink() || dirent.isDirectory())
  .map((dirent) => `${polarDependencyPathsBase}/${dirent.name}`)

if (!fs.existsSync(docPath)) {
  fs.mkdirSync(docPath)
}

const extractClientName = (clientPath) => {
  const parts = clientPath.split(path.sep)
  return parts[parts.length - 1]
}

const adjustRelativePathsInHtml = (htmlContent, basePath) => {
  return htmlContent.replace(
    /href="([^"]+\.md)(#[^"]*)?"/g,
    (match, url, hash) => {
      if (!url.startsWith('http') && !url.startsWith('#')) {
        const absolutePath = path.resolve(basePath, url)
        const relativePath = path.relative(docPath, absolutePath)
        const htmlPath = relativePath
          .replace(/\.md$/, '.html')
          .replace(/\\/g, '/')

        const clientName = extractClientName(basePath)
        const simplifiedPath = path.basename(htmlPath)
        const finalUrl = `https://dataport.github.io/polar/docs/${clientName}/${simplifiedPath}${
          hash || ''
        }`

        return `href="${finalUrl}"`
      }
      return match
    }
  )
}

fs.readdirSync(docPath).forEach((f) => fs.rmSync(`${docPath}/${f}`))
;[clientPath, ...dependencyPaths].forEach((path) => {
  const isMain = path === clientPath
  const markdownFile = `${path}/${isMain ? 'API.md' : 'README.md'}`
  // TODO: Filter temporarily disabled because it breaks the build -> isMain ? filter : (x) => x
  let html = ((x) => x)(
    toHtml(
      markdownFile,
      isMain
        ? dependencyPaths.map(
            (path) => getDistinguishingFileNameFromPath(path) + '.html'
          )
        : null
    )
  )

  html = adjustRelativePathsInHtml(html, path)

  if (isMain) {
    html = filter(html)
  }

  const targetName = `${
    path === clientPath ? 'client-' : ''
  }${getDistinguishingFileNameFromPath(path)}`
  fs.writeFileSync(`${docPath}/${targetName}.html`, html, fsOptions)
})

cssFiles.forEach((file) =>
  fs.writeFileSync(
    `${docPath}/${file}`,
    fs.readFileSync(`./node_modules/github-markdown-css/${file}`, fsOptions),
    fsOptions
  )
)
