/* eslint-disable no-console */
import fs from 'node:fs/promises'

await Promise.all([
	'.cache',
	'dist',
	'docs',
	'node_modules'
].map(async dir => {
	await fs.rm(dir, { recursive: true, force: true })
}))
