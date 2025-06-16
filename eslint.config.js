import { defineConfig } from 'eslint/config'
import mainConfig from '@dataport/eslint-config-geodev'
import browserConfig from '@dataport/eslint-config-geodev/browser'
import tsConfig from '@dataport/eslint-config-geodev/typescript'
import vueConfig from '@dataport/eslint-config-geodev/vue'

export default defineConfig([
	{
		ignores: ['vue2/'],
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
		extends: [mainConfig, browserConfig, tsConfig, vueConfig],
	},
])
