import vue from '@vitejs/plugin-vue'
import { globSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve, basename, sep } from 'node:path'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import commonJs from 'vite-plugin-commonjs'
import dts from 'vite-plugin-dts'
import kernExtraIcons from 'vite-plugin-kern-extra-icons'
import vueDevTools from 'vite-plugin-vue-devtools'

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
		dts({
			rollupTypes: true,
			tsconfigPath: './src/tsconfig.json',
		}),
		...(mode === 'development'
			? [
					checker({
						vueTsc: true,
						eslint: {
							lintCommand: 'eslint .',
							useFlatConfig: true,
							watchPath: [
								'./src',
								'./snowbox',
								'./scripts',
								'./vite.config.ts',
							],
						},
					}),
				]
			: []),
		kernExtraIcons({
			cssLayer: 'kern-ux-icons',
		}),
		enrichedConsole(),
	],
	build: {
		lib: {
			name: '@polar/polar',
			formats: ['es'],
			entry: {
				polar: 'src/core/index.ts',
				store: 'src/core/stores/index.ts',
				...Object.fromEntries(
					globSync('src/plugins/*/').flatMap((path) => [
						[`plugin-${basename(path)}`, [path, 'index.ts'].join(sep)],
						[`plugin-${basename(path)}-store`, [path, 'store.ts'].join(sep)],
					])
				),
			},
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
						// The order matters! Most specific paths need to be on the top.
						...Object.fromEntries(
							globSync('src/plugins/*/').flatMap((path) => [
								[
									`@polar/polar/plugins/${basename(path)}/store`,
									resolve(path, 'store.ts'),
								],
								[
									`@polar/polar/plugins/${basename(path)}`,
									resolve(path, 'index.ts'),
								],
							])
						),
						'@polar/polar/store': resolve(
							__dirname,
							'src',
							'core',
							'stores',
							'index.ts'
						),
						'@polar/polar/polar.css': resolve(
							__dirname,
							'src',
							'core',
							'.polar-dev.css'
						),
						'@polar/polar': resolve(__dirname, 'src', 'core', 'index.ts'),
					}
				: {}),
			'@': resolve(__dirname, 'src'),
			stream: require.resolve('stream-browserify'),
			timers: require.resolve('timers-browserify'),
			/* eslint-enable @typescript-eslint/naming-convention */
		},
	},
	test: {
		environment: 'jsdom',
		include: ['src/**/*.spec.ts'],
		includeSource: ['src/**/*.ts'],
	},
}))
