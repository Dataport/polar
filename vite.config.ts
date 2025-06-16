import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	plugins: [
		vue(),
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'lib', 'core', 'main.ts'),
			name: 'polar',
			fileName: 'polar',
		},
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, 'lib'),

			// mitigation for ignoring package.json exports in @masterportal/masterportalapi
			'olcs/lib/olcs': resolve(__dirname, 'node_modules', 'olcs', 'lib', 'olcs'),
			stream: require.resolve('stream-browserify'),
			timers: require.resolve('timers-browserify'),
		},
	},
	root: 'src',
	server: {
		port: 1234,
	},
})
