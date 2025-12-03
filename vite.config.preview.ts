import { resolve } from 'node:path'

import { defineConfig } from 'vite'

import commonJs from 'vite-plugin-commonjs'
import vue from '@vitejs/plugin-vue'
import enrichedConsole from './vitePlugins/enrichedConsole.js'

export default defineConfig({
	plugins: [
		// @ts-expect-error | commonJs dts is broken
		commonJs(),
		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => tag.includes('-'),
				},
			},
		}),
		enrichedConsole(),
	],
	build: {
		outDir: '.dist.preview',
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				snowbox: resolve(__dirname, 'examples', 'snowbox', 'index.html'),
			},
		},
	},
	preview: {
		port: 1235,
	},
	optimizeDeps: {
		entries: ['snowbox', 'iceberg'],
	},
})
