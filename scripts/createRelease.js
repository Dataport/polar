/* eslint-disable @typescript-eslint/no-var-requires */

// const fs = require('fs')
const { getOctokit, context } = require('@actions/github')

const [token, ...tags] = process.argv.slice(2)
const github = getOctokit({ auth: token })
const { owner, repo } = context.repo

for (const tag of tags) {
  console.warn(tag)
  github.request(`POST /repos/${owner}/${repo}/releases`, {
    owner,
    repo,
    tag_name: tag,
    name: tag,
    body: `Test`,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
}
