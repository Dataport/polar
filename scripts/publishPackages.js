/* eslint-env node */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const cp = require('child_process')
const fs = require('fs')
const { releaseVersion, releasePublish } = require('nx/release')
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
      // tags.push(`${packageName}@${nextVersion}`)

      releaseVersion({
        specifier: nextVersion,
        projects: [packageName],
        generatorOptionsOverrides: { updateDependents: true },
        gitCommitMessage: `Update package ${{ packageName }} to {version}.`,
        verbose: true,
      })
        .then(() =>
          releasePublish({
            verbose: false,
            projects: [packageName],
          })
        )
        .then((success) => {
          if (success !== 0) {
            throw new Error(
              `Failed to publish package ${packageName} with error code ${success}.`
            )
          }
          console.log(`Package ${packageName} published successfully!`)
        })
    }
  } catch (e) {
    console.error(e)
    process.exitCode = 1
  }
}

// process.stdout.write(tags.map((tag) => tag.trim()).join(' '))
