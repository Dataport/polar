/* eslint-env node */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { readdirSync } = require('fs')

const getPackagesIn = (path) =>
  readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => dirent.name !== 'snowbox')
    .map((dirent) => `${path}/${dirent.name}`)

module.exports = ['./packages/clients', './packages/lib', './packages/plugins']
  .map(getPackagesIn)
  .flat()
  .concat([
    // manually registered packages without a group folder
    './packages/core',
    './packages/components',
    './packages/types/custom',
  ])
