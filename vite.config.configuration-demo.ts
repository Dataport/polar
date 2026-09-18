import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import commonJs from 'vite-plugin-commonjs'
import kernExtraIcons from 'vite-plugin-kern-extra-icons'

export default defineConfig({
	base: './',
	plugins: [
		commonJs(),
		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => tag.includes('-'),
				},
			},
		}),
		kernExtraIcons({ cssLayer: 'kern-ux-icons' }),
	],
	build: {
		outDir: resolve(import.meta.dirname, 'docs'),
		emptyOutDir: false,
		rollupOptions: {
			input: resolve(import.meta.dirname, 'scripts', 'configuration-demo.ts'),
			output: {
				entryFileNames: 'configuration-demo.js',
				assetFileNames: (assetInfo) =>
					assetInfo.names[0].endsWith('.css')
						? 'configuration-demo.css'
						: 'assets/[name][extname]',
				inlineDynamicImports: true,
			},
		},
	},
	resolve: {
		alias: {
			/* eslint-disable @typescript-eslint/naming-convention */
			'@': resolve(import.meta.dirname, 'src'),
			/* eslint-enable @typescript-eslint/naming-convention */
		},
	},
})
