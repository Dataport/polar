import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	plugins: [
		vue(),
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'lib/core/main.ts'),
			name: 'polar',
			fileName: 'polar',
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './lib'),
			vue: 'vue/dist/vue.esm-bundler.js',
		},
	},
	root: 'src',
	server: {
		port: 1234,
	},
})
