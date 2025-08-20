import { globSync } from 'node:fs'
import { basename } from 'node:path'

export default {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'scope-enum': [
			2,
			'always',
			[
				'arch',
				'release',
				'core',
				...globSync('src/plugins/*/').map((path) => basename(path)),
			],
		],
	},
}
