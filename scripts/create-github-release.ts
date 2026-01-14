import { getOctokit, context } from '@actions/github'
import { readFileSync } from 'node:fs'
if (!process.env.GITHUB_TOKEN) {
	process.stderr.write('fatal: No GitHub token provided')
	process.exit(1)
}

const github = getOctokit(process.env.GITHUB_TOKEN)
const { owner, repo } = context.repo

const packageJson = JSON.parse(readFileSync('package.json').toString())
const packageName = packageJson.name
const packageVersion = packageJson.version

let body = ''
body += `[NPM package](https://www.npmjs.com/package/${packageName}/v/${packageVersion})`

await github.rest.repos.createRelease({
	owner,
	repo,
	tag_name: `v${packageVersion}`,
	name: `Version ${packageVersion}`,
	body,
})
