import { createRequire } from 'node:module'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'

import commonJs from 'vite-plugin-commonjs'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import dts from 'vite-plugin-dts'
import checker from 'vite-plugin-checker'
import enrichedConsole from './vitePlugins/enrichedConsole.js'

const require = createRequire(import.meta.url)

export default defineConfig(({ mode }) => ({
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
		vueDevTools(),
		dts({ rollupTypes: true }),
		checker({
			vueTsc: true,
			eslint: {
				lintCommand: 'eslint .',
				useFlatConfig: true,
				watchPath: ['./src', './snowbox', './scripts', './vite.config.ts'],
			},
		}),
		enrichedConsole(),
	],
	build: {
		lib: {
			name: '@polar/polar',
			fileName: 'polar',
			entry: 'src/core/index.ts',
		},
		sourcemap: true,
		target: 'esnext',
	},
	server: {
		port: 1234,
	},
	optimizeDeps: {
		entries: ['!vue2'],
		exclude: ['geojson'],
	},
	resolve: {
		alias: {
			/* eslint-disable @typescript-eslint/naming-convention */
			...(mode === 'development'
				? {
						'@polar/polar': resolve(__dirname, 'src', 'core', 'index.ts'),
					}
				: {}),
			'@': resolve(__dirname, 'src'),
			stream: require.resolve('stream-browserify'),
			timers: require.resolve('timers-browserify'),
			/* eslint-enable @typescript-eslint/naming-convention */
		},
	},
}))
