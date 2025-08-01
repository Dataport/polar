import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		outDir: '.dist.snowbox',
	},
	preview: {
		port: 1235,
	},
	optimizeDeps: {
		entries: ['snowbox'],
	},
})
