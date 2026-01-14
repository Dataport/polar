import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import commonJs from 'vite-plugin-commonjs'
import kernExtraIcons from 'vite-plugin-kern-extra-icons'

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
		kernExtraIcons({
			cssLayer: 'kern-ux-icons',
			ignoreFilename: (filename) => !filename.includes('/examples/iceberg/'),
		}),
		enrichedConsole(),
	],
	build: {
		outDir: '.dist.preview',
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				snowbox: resolve(__dirname, 'examples', 'snowbox', 'index.html'),
				iceberg: resolve(__dirname, 'examples', 'iceberg', 'index.html'),
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
