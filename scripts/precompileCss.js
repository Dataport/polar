/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

/*
 * This script parses CSS variables in .css files' :root to JSON objects.
 * E.g.:
 *  - Input: `:root{--var:#fff}`
 *  - Output: `{var: '#fff'}`
 *
 * Written for NPM package `diplanung-style`, ignoring lots of (edge) cases.
 * Extend on new use cases.
 *
 * Call example: node ./scripts/precompileSvg.js ./a/style.css ./b/vars.ts
 */

const fs = require('fs')
const fsOptions = { encoding: 'utf8' }

const sourceFile = process.argv[2]
const targetFile = process.argv[3]

const cssText = fs.readFileSync(sourceFile, fsOptions)

const targetFileContent = `const styleVariables: Record<string, string> = ${JSON.stringify(
  cssText
    .split(':root{')[1]
    .split('}')[0]
    .split(';')
    .reduce((accumulator, current) => {
      const [key, value] = current.split(':')
      accumulator[
        key
          .trim()
          .replaceAll('--', '')
          .split('-')
          .map((s, i) => (i === 0 ? s : `${s[0].toUpperCase()}${s.slice(1)}`))
          .join('')
      ] = value.trim()
      return accumulator
    }, {}),
  null,
  2
)}

export default styleVariables
`

fs.writeFileSync(targetFile, targetFileContent, fsOptions)
