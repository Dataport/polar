// This script is heavily experimental.
// It requires that dev mode was started at least once with vite-plugin-checker enabled.

import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const __dirname = dirname(fileURLToPath(import.meta.url))
const basePath = resolve(__dirname, '..')

const vueTsPath = resolve(
	basePath,
	'node_modules',
	'vite-plugin-checker',
	'dist',
	'checkers',
	'vueTsc',
	'typescript-vue-tsc'
)

const targetTsParentPath = resolve(
	basePath,
	'node_modules',
	'typedoc',
	'node_modules'
)

const targetTsPath = resolve(targetTsParentPath, 'typescript')

if (!existsSync(targetTsParentPath)) {
	mkdirSync(targetTsParentPath, {
		recursive: true,
	})
}

if (existsSync(targetTsPath)) {
	// VueTS was already installed.
	process.exit(0)
}

cpSync(vueTsPath, targetTsPath, {
	recursive: true,
})
