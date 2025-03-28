/* eslint-env node */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs')
const cp = require('child_process')
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
      const packageName = getPackageName(path)
      tags.push(`${packageName}@${nextVersion}`)

      cp.execSync(
        `npx nx release version --projects ${packageName} --specifier ${nextVersion} --git-commit-message "Update package ${packageName} to {version}." --verbose false`,
        { stdio: ['pipe', 'ignore', 'pipe'] }
      )
    }
  } catch (e) {
    console.error(e)
    process.exitCode = 1
  }
}

process.stdout.write(tags.map((tag) => tag.trim()).join(' '))
