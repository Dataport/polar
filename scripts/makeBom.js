/* eslint-env node */

/* eslint-disable @typescript-eslint/no-var-requires */

/*
 * Generates the bom.json for a client.
 * Call like `node ./scripts/makeBom.js ./path/to/client type`,
 * where type can be either `library` or `application`.
 */

const fs = require('fs')
const cp = require('child_process')
const {
  constants: { MAX_LENGTH: BUFFER_MAX_LENGTH },
} = require('buffer')

const [path, type] = process.argv.slice(2)

const getBom = (head) =>
  JSON.parse(
    cp.execSync(
      [
        'npx @cyclonedx/cyclonedx-npm',
        `--mc-type ${type}`,
        /* Quote Docs:
         * «This might be used, if "npm install" was run with "--force" or "--legacy-peer-deps".» (https://github.com/CycloneDX/cyclonedx-node-npm)
         * The latter is the case here.
         */
        '--ignore-npm-errors',
      ].join(' ') + (head ? ` ${path}/package.json` : ''),
      {
        stdio: ['ignore', 'pipe', 'ignore'],
        encoding: 'buffer',
        maxBuffer: BUFFER_MAX_LENGTH,
      }
    )
  )

const bom = getBom(false)
const componentBom = getBom(true)

bom.metadata.component = componentBom.metadata.component
// SIC! This changes in CycloneDX v1.6 JSON Specification to "manufacturer" (https://cyclonedx.org/docs/1.6/)
bom.metadata.manufacture = {
  name: 'Dataport AöR',
  contact: [{ email: 'dataportpolarsupport@dataport.de' }],
}

fs.writeFileSync(`${path}/bom.json`, JSON.stringify(bom, null, 2), {
  encoding: 'utf8',
})
