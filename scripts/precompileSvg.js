/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

/*
 * This script parses icomoon svg exports to JSON objects that have icon names
 * as keys and the path commands ('d') as value. Hint: That return fits the
 * configuration of vuetify in vuetifyOptions.icons.values. See core docs.
 *
 * Call example: node ./scripts/precompileSvg.js ./a/icons.svg ./b/icons.ts
 */

const fs = require('fs')
const fsOptions = { encoding: 'utf8' }

const sourceFile = process.argv[2]
const targetFile = process.argv[3]

const svg = fs.readFileSync(sourceFile, fsOptions)

const targetFileContent = `const iconMap: Record<string, string> = ${JSON.stringify(
  svg
    .split('\n')
    .filter(
      (line) => line.startsWith('<glyph') && line.includes('glyph-name="')
    )
    .reduce((accumulator, current) => {
      accumulator[/glyph-name="(.*)"/g.exec(current)[1].split('"')[0]] =
        /d="(.*)"/g.exec(current)[1].split('"')[0]
      return accumulator
    }, {}),
  null,
  2
)}

export default iconMap
`

fs.writeFileSync(targetFile, targetFileContent, fsOptions)
