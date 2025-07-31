import { defineConfig } from 'vite'

import commonJs from 'vite-plugin-commonjs'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [
		commonJs(),
		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => tag.includes('-'),
				},
			},
		}),
	],
	build: {
		lib: {
			name: '@polar/polar',
			fileName: 'polar',
			entry: 'src/core/index.ts',
		},
		sourcemap: true,
	},
	server: {
		port: 1234,
	},
})
