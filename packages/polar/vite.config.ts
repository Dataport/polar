import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [
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
			entry: 'core/src/index.ts',
		},
		sourcemap: true,
	},
})
