import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import commonJs from 'vite-plugin-commonjs'
import kernExtraIcons from 'vite-plugin-kern-extra-icons'

import enrichedConsole from './vitePlugins/enrichedConsole.js'

export default defineConfig({
	root: resolve(__dirname, 'examples', 'github-io'),
	base: './',
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
			ignoreFilename: (filename) => !filename.includes('/examples/github-io/'),
		}),
		enrichedConsole(),
	],
	build: {
		outDir: resolve(__dirname, 'examples', 'github-io', 'dist'),
		chunkSizeWarningLimit: 1536,
		emptyOutDir: true,
		rolldownOptions: {
			external: ['@polar/polar', '@polar/polar/client', '@polar/polar/store'],
			input: resolve(__dirname, 'examples', 'github-io', 'index.html'),
			output: {
				entryFileNames: '[name].js',
				chunkFileNames: '[name].js',
				assetFileNames: '[name].[ext]',
			},
		},
	},
	preview: {
		port: 1236,
	},
})
