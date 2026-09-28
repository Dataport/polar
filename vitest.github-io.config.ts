import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			/* eslint-disable @typescript-eslint/naming-convention */
			'@': resolve(import.meta.dirname, 'src'),
			/* eslint-enable @typescript-eslint/naming-convention */
		},
	},
	test: {
		environment: 'jsdom',
		include: ['examples/github-io/**/*.spec.ts'],
	},
})
