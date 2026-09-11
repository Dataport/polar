import vue from '@vitejs/plugin-vue'
import { globSync, readdirSync } from 'node:fs'
import { basename, join, relative, resolve, sep } from 'node:path'
import dts from 'unplugin-dts/vite'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import commonJs from 'vite-plugin-commonjs'
import kernExtraIcons from 'vite-plugin-kern-extra-icons'
import vueDevTools from 'vite-plugin-vue-devtools'

import enrichedConsole from './vitePlugins/enrichedConsole.js'

/**
 * Collects public `lib` entries for subpath exports (e.g.`@polar/polar/lib/invisibleStyle`).
 * A directory with an `index.ts` is exposed only via its folder path;
 * otherwise each `.ts` file is exposed and subdirectories are traversed.
 */
function collectLibEntries() {
	const baseDir = resolve(import.meta.dirname, 'src')
	const entries: Record<string, string> = {}

	const toKey = (absPath: string) =>
		relative(baseDir, absPath).split(sep).join('/')
	const addEntry = (key: string, file: string) => {
		if (entries[key]) {
			console.warn(
				`[vite.config] Duplicate lib entry key "${key}"; ignoring "${file}".`
			)
			return
		}
		entries[key] = file
	}
	const walk = (currentDir: string) => {
		const items = readdirSync(currentDir, { withFileTypes: true })
		if (items.some((item) => item.isFile() && item.name === 'index.ts')) {
			addEntry(toKey(currentDir), join(currentDir, 'index.ts'))
			return
		}
		for (const item of items) {
			const full = join(currentDir, item.name)
			if (item.isDirectory()) {
				walk(full)
			} else if (item.isFile() && item.name.endsWith('.ts')) {
				addEntry(toKey(full).replace(/\.ts$/, ''), full)
			}
		}
	}

	walk(join(baseDir, 'lib'))

	return entries
}

const libEntries = collectLibEntries()

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
			bundleTypes: true,
			processor: 'vue',
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
				client: 'src/client.ts',
				polar: 'src/core/index.ts',
				store: 'src/core/stores/index.ts',
				...Object.fromEntries(
					globSync('src/plugins/*/').flatMap((path) => [
						[`plugin-${basename(path)}`, [path, 'index.ts'].join(sep)],
						[`plugin-${basename(path)}-store`, [path, 'store.ts'].join(sep)],
					])
				),
				...libEntries,
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
						// lib keys are never a prefix of one another, so their order is irrelevant.
						...Object.fromEntries(
							Object.entries(libEntries).map(([key, file]) => [
								`@polar/polar/${key}`,
								file,
							])
						),
						'@polar/polar/client': resolve(
							import.meta.dirname,
							'src',
							'client.ts'
						),
						'@polar/polar/store': resolve(
							import.meta.dirname,
							'src',
							'core',
							'stores',
							'index.ts'
						),
						'@polar/polar/polar.css': resolve(
							import.meta.dirname,
							'src',
							'core',
							'.polar-dev.css'
						),
						'@polar/polar': resolve(
							import.meta.dirname,
							'src',
							'core',
							'index.ts'
						),
					}
				: {}),
			'@': resolve(import.meta.dirname, 'src'),
			/* eslint-enable @typescript-eslint/naming-convention */
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.spec.ts'],
		includeSource: ['src/**/*.ts'],
		coverage: {
			all: true,
			include: ['src/**/*.{ts,vue}'],
			exclude: ['**/*.d.ts', 'src/test/**'],
		},
	},
}))
