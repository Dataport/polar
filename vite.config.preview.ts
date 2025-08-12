import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
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
		entries: ['snowbox'],
	},
})
