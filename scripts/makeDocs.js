/* eslint-env node */

/* eslint-disable @typescript-eslint/no-var-requires */

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
 *
 * Headings in markdowns will get a slugified ID by markdown-it-anchor to be linkable.
 * It uses the default slugify function:
 * (s) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'))
 *
 */

// IMPORTS
const fs = require('fs')
const MarkdownIt = require('markdown-it')

// SETUP
const fsOptions = { encoding: 'utf8' }
const client = process.argv[2]
const clientPath = `./packages/clients/${client}`
const docPath = `${clientPath}/docs`
const polarDependencyPathsBase = `node_modules/@polar`
const cssFiles = [
  'github-markdown.css',
  'github-markdown-light.css',
  'github-markdown-dark.css',
]
const markdownIt = new MarkdownIt({
  html: true,
  xhtmlOut: true,
}).use(require('markdown-it-anchor'))

const defaultHTMLRender = markdownIt.renderer.rules.html_block

markdownIt.renderer.rules.html_block = (tokens, idx, options, env, self) => {
  ;[...tokens[idx].content.matchAll(/.*src="([^"]*)".*/g)].forEach((match) => {
    fs.cp(`${env.basePath}/${match[1]}`, `${docPath}/${match[1]}`, (err) => {
      if (err) {
        console.error(
          `Asset copy failed: ${env.basePath}/${match[1]} not found! Please use a relative path and correct the path in ${match.input}`
        )
      }
    })
  })

  return defaultHTMLRender(tokens, idx, options, env, self)
}

/**
 * HTMLifies and styles a markdown file.
 * @param {string} basePath base path client or dependency
 * @param {string} markdownFileName name of markdown file
 * @param {string[]} [children] files to link to at end of document
 * @returns {string} html document
 */
function toHtml(basePath, markdownFileName, children) {
  const markdownFilePath = `${basePath}/${markdownFileName}`
  const clientText = fs.readFileSync(markdownFilePath, fsOptions)
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
    ${markdownIt.render(clientText, { basePath })}
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

const polarDependencies = Object.keys(
  JSON.parse(fs.readFileSync(`${clientPath}/package.json`, fsOptions))
    .devDependencies
).filter((dependency) => dependency.startsWith('@polar'))

const dependencyPaths = fs
  .readdirSync(polarDependencyPathsBase, { ...fsOptions, withFileTypes: true })
  .filter(
    (dirent) =>
      (dirent.isSymbolicLink() || dirent.isDirectory()) &&
      polarDependencies.includes(`@polar/${dirent.name}`)
  )
  .map((dirent) => `${polarDependencyPathsBase}/${dirent.name}`)

if (!fs.existsSync(docPath)) {
  fs.mkdirSync(docPath)
}

const adjustRelativePathsInHtml = (htmlContent) => {
  return htmlContent.replace(
    /..\/..\/core\/README.md#global-plugin-parameters/g,
    () =>
      `https://dataport.github.io/polar/docs/${client}/core.html#global-plugin-parameters`
  )
}

fs.readdirSync(docPath).forEach((f) =>
  fs.rmSync(`${docPath}/${f}`, { recursive: true })
)
;[clientPath, ...dependencyPaths].forEach((basePath) => {
  const isMain = basePath === clientPath
  const markdownFileName = `${isMain ? 'API.md' : 'README.md'}`
  let html = toHtml(
    basePath,
    markdownFileName,
    isMain
      ? dependencyPaths.map(
          (path) => getDistinguishingFileNameFromPath(path) + '.html'
        )
      : null
  )

  html = adjustRelativePathsInHtml(html)

  if (isMain) {
    html = filter(html)
  }

  const targetName = `${
    basePath === clientPath ? 'client-' : ''
  }${getDistinguishingFileNameFromPath(basePath)}`
  fs.writeFileSync(`${docPath}/${targetName}.html`, html, fsOptions)
})

cssFiles.forEach((file) =>
  fs.writeFileSync(
    `${docPath}/${file}`,
    fs.readFileSync(`./node_modules/github-markdown-css/${file}`, fsOptions),
    fsOptions
  )
)
