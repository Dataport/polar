import { createRequire } from 'node:module'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'

import commonJs from 'vite-plugin-commonjs'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import dts from 'vite-plugin-dts'
import checker from 'vite-plugin-checker'
import enrichedConsole from './vitePlugins/enrichedConsole.js'
import kernExtraIcons from './vitePlugins/kernExtraIcons.js'

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
		enrichedConsole(),
		kernExtraIcons(),
	],
	build: {
		lib: {
			name: '@polar/polar',
			formats: ['es'],
			entry: {
				// TODO(oeninghe-dataport): Generate this code
				/* eslint-disable @typescript-eslint/naming-convention */
				polar: 'src/core/index.ts',
				store: 'src/core/stores/export.ts',
				'plugin-fullscreen': 'src/plugins/fullscreen/index.ts',
				'plugin-fullscreen-store': 'src/plugins/fullscreen/store.ts',
				/* eslint-enable @typescript-eslint/naming-convention */
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
						// TODO(oeninghe-dataport): Generate this code
						'@polar/polar/plugins/fullscreen/store': resolve(
							__dirname,
							'src',
							'plugins',
							'fullscreen',
							'store.ts'
						),
						'@polar/polar/plugins/fullscreen': resolve(
							__dirname,
							'src',
							'plugins',
							'fullscreen',
							'index.ts'
						),
						'@polar/polar/store': resolve(
							__dirname,
							'src',
							'core',
							'stores',
							'export.ts'
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
		include: ['src/**/*.spec.ts'],
	},
}))
