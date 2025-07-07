import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { externalizeDeps } from 'vite-plugin-externalize-deps'

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'

import { globSync } from 'glob'

import pkg from './package.json'

export default defineConfig({
	root: __dirname,
	plugins: [
		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => tag.includes('-'),
				},
			},
		}),
		nxViteTsPaths(),
		dts({
			root: '../../',
			entryRoot: 'packages/polar/src',
			include: [ '**/*.ts', '**/*.vue' ],
			exclude: [ '**/vite.config.ts' ],
			outDir: 'packages/polar/dist',
			skipDiagnostics: false,
		}),
		externalizeDeps({
		}),
	],
	build: {
		minify: false,
		sourcemap: true,
		outDir: './dist',
		reportCompressedSize: false,
		lib: {
			name: '@polar/polar',
			entry: Object.fromEntries(
				globSync('src/**/*.{js,ts,vue}').map(file => [
					path.relative(
						'src',
						file.slice(0, file.length - path.extname(file).length)
					),
					fileURLToPath(new URL(file, import.meta.url))
				])
			),
			formats: ['es'],
		},
	},
})
