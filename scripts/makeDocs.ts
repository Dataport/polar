/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

// keeping it simply stupid; .ts is just here to get to import language.ts files
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

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
 * Call like `tsx ./scripts/makeDocs.ts ./path/to/client`.
 *
 * Headings in markdowns will get a slugified ID by markdown-it-anchor to be linkable.
 * It uses the default slugify function:
 * (s) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'))
 *
 */

// IMPORTS
const fs = require('fs')
const path = require('path')
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
const head = `<head>
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
</head>`

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
 * Flattens an object, e.g. { a: { b: 4 }} becomes { "a.b": 4 }.
 * @param {*} maybeObject maybe not an object
 * @returns {*} flattened object or input back if it wasn't an object
 */
const flattenObject = (maybeObject) => {
  if (typeof maybeObject !== 'object') {
    return maybeObject
  }

  return Object.entries(maybeObject).reduce((accumulator, [key, value]) => {
    if (typeof value === 'object') {
      const flatChild = flattenObject(value)
      Object.entries(flatChild).forEach(([childKey, childValue]) => {
        accumulator[`${key}.${childKey}`] = childValue
      })
    } else {
      accumulator[key] = value
    }
    return accumulator
  }, {})
}

/**
 * @param {LanguageOption[]} locales as seen in the packages' language.ts files
 * @returns {string} html table
 */
function makeLocaleTable(locales) {
  const keyMap = {}

  locales.forEach(({ type, resources }) => {
    const flatResources = flattenObject(resources)
    Object.entries(flatResources).forEach(([key, value]) => {
      if (keyMap[key]) {
        keyMap[key][type] = value
      } else {
        keyMap[key] = { [type]: value }
      }
    })
  })

  return `
    <table>
      <thead>
        <tr>
          <th scope="col">Locale Key</th>
          <th scope="col">German default</th>
          <th scope="col">English default</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(keyMap)
          .map(
            ([key, { en, de }]) => `
        <tr>
          <td>${key}</td>
          <td>${de ?? ''}</td>
          <td>${en ?? ''}</td>
        </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `
}

/**
 * HTMLifies and styles a markdown file.
 * @param {string} basePath base path client or dependency
 * @param {string} markdownFileName name of markdown file
 * @param {string[]} [children] files to link to at end of document
 * @returns {string} html document
 */
async function toHtml(basePath, markdownFileName, children) {
  const markdownFilePath = `${basePath}/${markdownFileName}`
  const clientText = fs.readFileSync(markdownFilePath, fsOptions)

  let maybeLocales
  const localesPath = path.join(basePath, 'src', 'language')
  if (fs.existsSync(`${localesPath}.ts`)) {
    maybeLocales = (await import(`../${localesPath.replaceAll('\\', '/')}.ts`))
      .default
  }

  return `<!DOCTYPE html>
<html lang="en">
${head}
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
    ${maybeLocales ? `<h2>Locales</h2>${makeLocaleTable(maybeLocales)}` : ''}
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
    /..\/..\/core\/README.md/g,
    () => `https://dataport.github.io/polar/docs/${client}/core.html`
  )
}

fs.readdirSync(docPath).forEach((f) =>
  fs.rmSync(`${docPath}/${f}`, { recursive: true })
)
;[clientPath, ...dependencyPaths].forEach(async (basePath) => {
  const isMain = basePath === clientPath
  const markdownFileName = `${isMain ? 'API.md' : 'README.md'}`
  let html = await toHtml(
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
