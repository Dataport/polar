/* eslint-disable @typescript-eslint/no-var-requires */

// const fs = require('fs')
const { getOctokit, context } = require('@actions/github')

const tags = process.argv.slice(2)
const github = getOctokit({ auth: process.env.GITHUB_TOKEN })
const { owner, repo } = context.repo

console.info(process.env.GITHUB_TOKEN)

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
