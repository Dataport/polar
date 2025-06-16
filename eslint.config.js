import { defineConfig } from 'eslint/config'
import mainConfig from '@dataport/eslint-config-geodev'
import browserConfig from '@dataport/eslint-config-geodev/browser'
import tsConfig from '@dataport/eslint-config-geodev/typescript'
import vueConfig from '@dataport/eslint-config-geodev/vue'
import vuePugConfig from '@dataport/eslint-config-geodev/vue-pug'

export default defineConfig([
	{
		ignores: ['vue2/', '**/build',
			'**/.cache',
			'**/coverage',
			'**/dist',
			'**/dist-test',
			'**/docs',
			'**/node_modules',
			'**/tests_output',
			'*.d.ts',
			'/.nx/',
		],
	},
	{
		files: ['**/*.js'],
		extends: [mainConfig, browserConfig],
	},
	{
		files: ['**/*.ts'],
		extends: [mainConfig, browserConfig, tsConfig],
	},
	{
		files: ['**/*.vue'],
		extends: [mainConfig, browserConfig, tsConfig, vueConfig, vuePugConfig],
	},
])
