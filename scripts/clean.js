/* eslint-disable no-console */
const { exec } = require('child_process') // eslint-disable-line
const { promisify } = require('util') // eslint-disable-line
const os = require('os') // eslint-disable-line
const { rimraf } = require('rimraf') // eslint-disable-line

const execAsync = promisify(exec)

async function clean() {
  await execAsync('nx reset')
  console.log('nx cache was reset.')

  await rimraf('{.cache,dist,node_modules}', { glob: true })
  await rimraf('packages/**/{.cache,dist,docs,node_modules}', {
    glob: { ignore: 'packages/clients/diplan/vendored/**' },
  })
  console.log(
    'Build artifacts (.cache, dist, docs) and node_modules were purged.'
  )
}
clean()
