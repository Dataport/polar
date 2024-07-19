/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const cp = require('child_process')
const fs = require('fs')
const packages = require('./packages')

const tags = []

function checkForNewVersion(cwd) {
  const { version } = JSON.parse(
    fs.readFileSync(cwd + '/package.json', { encoding: 'UTF-8' })
  )
  const markdown = fs.readFileSync(cwd + '/CHANGELOG.md', { encoding: 'UTF-8' })
  const nextVersion = markdown.split('## ')[1].split('\n')[0].trim()

  if (/^\d+\.\d+\.\d+(-.+)?$/.test(nextVersion) && version !== nextVersion) {
    return nextVersion
  }
}

function getPackageName(cwd) {
  const { name } = JSON.parse(
    fs.readFileSync(cwd + '/package.json', { encoding: 'UTF-8' })
  )
  return name
}

for (const path of packages) {
  try {
    const nextVersion = checkForNewVersion(path)
    if (nextVersion) {
      /* NOTE
       * throw away logs with `stdio: []`
       * `npm version` ignored `--silent`, no matter what, hence this measure.
       */
      const context = { cwd: path, stdio: [] }
      tags.push(`${getPackageName(path)}@${nextVersion}`)

      cp.execSync('npm version ' + nextVersion, context)
      cp.execSync(
        'npm set //registry.npmjs.org/:_authToken ' +
          process.env.NODE_AUTH_TOKEN,
        { cwd: path }
      )
      cp.execSync('npm publish --access=public', context)
    }
  } catch (e) {
    console.error(e)
    process.exitCode = 1
  }
}

process.stdout.write(tags.map((tag) => tag.trim()).join(' '))
