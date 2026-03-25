import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

import kernExtraIcons from 'vite-plugin-kern-extra-icons'

export default defineConfig({
	plugins: [
		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => tag.includes('-'),
				},
			},
		}),
		kernExtraIcons({
			cssLayer: 'kern-ux-icons',
			ignoreFilename: (filename) =>
				!filename.includes('/examples/github-io/'),
		}),
	],
	build: {
		outDir: resolve(__dirname, 'examples', 'github-io', 'dist'),
		emptyOutDir: true,
		rollupOptions: {
			external: ['@polar/polar', '@polar/polar/client', '@polar/polar/store'],
			input: resolve(__dirname, 'examples', 'github-io', 'index.html'),
			output: {
				entryFileNames: '[name].js',
				chunkFileNames: '[name].js',
				assetFileNames: '[name].[ext]',
			},
		},
	},
})
