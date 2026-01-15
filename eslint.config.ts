import mainConfig from '@dataport/eslint-config-geodev'
import browserConfig from '@dataport/eslint-config-geodev/browser'
import htmlConfig from '@dataport/eslint-config-geodev/html'
import jsonConfig from '@dataport/eslint-config-geodev/json'
import markdownConfig from '@dataport/eslint-config-geodev/markdown'
import tsConfig from '@dataport/eslint-config-geodev/typescript'
import vueConfig from '@dataport/eslint-config-geodev/vue'
import perfectionist from 'eslint-plugin-perfectionist'
import prettierConfig from 'eslint-plugin-prettier/recommended'
import { defineConfig } from 'eslint/config'

/**
 * POLAR-specific ESLint configuration
 */
const polarConfig = defineConfig({
	plugins: {
		perfectionist,
	},
	rules: {
		'prettier/prettier': 'error',

		// Re-enable rules that are disabled by prettier but do not collide
		curly: ['error', 'all'],

		// POLAR-specific rules
		'no-warning-comments': 'warn',
		'no-void': 'off',
		'@stylistic/lines-around-comment': [
			'error',
			{
				beforeBlockComment: true,
				allowBlockStart: true,
				allowObjectStart: true,
				allowArrayStart: true,
				allowClassStart: true,
				allowEnumStart: true,
				allowInterfaceStart: true,
				allowModuleStart: true,
				allowTypeStart: true,
			},
		],
		'import-x/order': 'off',
		'perfectionist/sort-imports': 'error',
	},
})

/**
 * POLAR-specific TypeScript ESLint configuration
 */
const polarTsConfig = defineConfig({
	rules: {
		// Relaxed rules
		'@typescript-eslint/no-unsafe-argument': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
		'@typescript-eslint/restrict-template-expressions': [
			'error',
			{
				allowAny: true,
				allowNumber: true,
			},
		],

		// POLAR-specific rules
		'perfectionist/sort-interfaces': [
			'error',
			{
				type: 'natural',
				groups: ['required-member', 'unknown'],
			},
		],
	},
})

/**
 * POLAR-specific Vue ESLint configuration
 */
const polarVueConfig = defineConfig({
	rules: {
		// POLAR-specific rules
		'vue/no-empty-component-block': 'error',
		'vue/block-order': [
			'error',
			{
				order: ['template', 'script', 'style'],
			},
		],
		'vue/block-lang': [
			'error',
			{
				template: {
					allowNoLang: true,
				},
				script: {
					lang: 'ts',
				},
				style: {
					allowNoLang: true,
				},
			},
		],
		'vue/component-api-style': ['error', ['script-setup', 'composition']],
		'vue/require-default-export': 'error',
		'vue/enforce-style-attribute': ['error', { allow: ['scoped'] }],
	},
})

/**
 * POLAR-specific HTML ESLint configuration
 */
const polarHtmlConfig = defineConfig({
	rules: {
		// POLAR-specific rules
		'@html-eslint/require-closing-tags': ['error', { selfClosing: 'always' }],
		'@html-eslint/no-extra-spacing-attrs': [
			'error',
			{ enforceBeforeSelfClose: true },
		],
	},
})

export default defineConfig([
	{
		ignores: [
			'vue2/',
			'node_modules/',
			'docs/assets/',
			'docs-html/',
			'.vscode/',
			'dist/',
			'.dist.preview/',

			// Legacy list
			'**/build',
			'**/.cache',
			'**/coverage',
			'**/tests_output',
			'*.d.ts',
			'.nx/',
		],
	},
	{
		files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
		extends: [mainConfig, browserConfig, prettierConfig, polarConfig],
	},
	{
		files: ['**/*.ts'],
		extends: [
			mainConfig,
			browserConfig,
			tsConfig,
			prettierConfig,
			polarConfig,
			polarTsConfig,
		],
	},
	{
		files: ['**/eslint.config.ts'],
		rules: {
			'@typescript-eslint/naming-convention': 'off',
		},
	},
	{
		files: ['**/*.vue'],
		extends: [
			mainConfig,
			browserConfig,
			tsConfig,
			vueConfig,
			prettierConfig,
			polarConfig,
			polarTsConfig,
			polarVueConfig,
		],
	},
	{
		files: ['**/examples/**/*.vue'],
		rules: {
			'vue/enforce-style-attribute': ['error', { allow: ['scoped', 'module'] }],
		},
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
	{
		files: ['**/*.html'],
		extends: [htmlConfig, polarHtmlConfig],
	},
])
