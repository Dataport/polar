/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs')
const { getOctokit, context } = require('@actions/github')

const tags = process.argv.slice(2)
const github = getOctokit(process.env.GITHUB_TOKEN)
const { owner, repo } = context.repo

const camelize = (strings, all = false) =>
  (all ? '' : strings[0]) +
  strings
    .slice(all ? 0 : 1)
    .map((string) => string.charAt(0).toUpperCase() + string.slice(1))
    .join('')

function getBody(tag) {
  const [packageName, packageVersion] = tag.split('@').slice(1)
  const name = packageName.split('/')[1]
  const nameParts = name.split('-')
  let filePath

  if (nameParts[0] === 'core' || nameParts[0] === 'components') {
    filePath = `./packages/${nameParts[0]}`
  } else if (name === 'lib-custom-types') {
    filePath = `./packages/types/custom`
  } else if (nameParts[0] === 'plugin' || nameParts[0] === 'client') {
    filePath = `./packages/${nameParts[0]}s/${camelize(
      nameParts.slice(1),
      nameParts[0] === 'plugin'
    )}`
  } else if (nameParts[0] === 'lib') {
    filePath = `./packages/${nameParts[0]}/${camelize(nameParts.slice(1))}`
  } else {
    const message = `Unknown package name in tag ${tag}.`
    console.error(message)
    process.exit = 1
    throw new Error(message)
  }
  const data = fs.readFileSync(`${filePath}/CHANGELOG.md`, { encoding: 'utf8' })
  return `## CHANGELOG
${data
  .split('##')[1]
  .split('\n')
  .slice(1)
  .join(
    '\n'
  )}[NPM package](https://www.npmjs.com/package/@${packageName}/v/${packageVersion})`
}

for (const tag of tags) {
  github.request(`POST /repos/${owner}/${repo}/releases`, {
    owner,
    repo,
    tag_name: tag,
    name: tag,
    body: getBody(tag),
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
}
