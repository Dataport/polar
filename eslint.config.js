import { defineConfig } from 'eslint/config'
import mainConfig from '@dataport/eslint-config-geodev'
import browserConfig from '@dataport/eslint-config-geodev/browser'
import tsConfig from '@dataport/eslint-config-geodev/typescript'
import vueConfig from '@dataport/eslint-config-geodev/vue'
import vuePugConfig from '@dataport/eslint-config-geodev/vue-pug'
import jsonConfig from '@dataport/eslint-config-geodev/json'
import markdownConfig from '@dataport/eslint-config-geodev/markdown'
import prettierConfig from 'eslint-plugin-prettier/recommended'

export default defineConfig([
	{
		ignores: [
			'vue2/',
			'**/build',
			'**/.cache',
			'**/coverage',
			'**/dist',
			'**/dist-test',
			'**/docs',
			'**/node_modules',
			'**/tests_output',
			'*.d.ts',
			'.nx/',
		],
	},
	{
		files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
		extends: [
			mainConfig,
			browserConfig,
			prettierConfig,
			{
				rules: {
					'prettier/prettier': [
						'error',
						{
							semi: false,
							trailingComma: 'es5',
							singleQuote: true,
							printWidth: 80,
							tabWidth: 2,
							useTabs: true,
						},
					],
				},
			},
		],
	},
	{
		files: ['**/*.ts'],
		extends: [
			mainConfig,
			browserConfig,
			tsConfig,
			prettierConfig,
			{
				rules: {
					'prettier/prettier': [
						'error',
						{
							semi: false,
							trailingComma: 'es5',
							singleQuote: true,
							printWidth: 80,
							tabWidth: 2,
							useTabs: true,
						},
					],
				},
			},
		],
	},
	{
		files: ['**/*.vue'],
		extends: [
			mainConfig,
			browserConfig,
			tsConfig,
			vueConfig,
			vuePugConfig,
			prettierConfig,
			{
				rules: {
					'prettier/prettier': [
						'error',
						{
							semi: false,
							trailingComma: 'es5',
							singleQuote: true,
							printWidth: 80,
							tabWidth: 2,
							useTabs: true,
						},
					],
				},
			},
		],
	},
	{
		files: ['**/*.json'],
		ignores: ['package-lock.json'],
		extends: [jsonConfig],
	},
	{
		files: ['**/*.md'],
		extends: [markdownConfig],
	},
])
