import fs from 'node:fs/promises'

await Promise.all(
	['.cache', 'dist', 'docs-html', 'node_modules'].map(
		async (dir) => await fs.rm(dir, { recursive: true, force: true })
	)
)
