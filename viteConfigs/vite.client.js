import { createRequire } from 'module'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import commonJs from 'vite-plugin-commonjs'
import vue from '@vitejs/plugin-vue'

const require = createRequire(import.meta.url)

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
	root: 'src',
	define: {
		'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
	},
	build: {
		outDir: '../dist',
		sourcemap: true,
	},
	server: {
		port: 1234,
	},
	optimizeDeps: {
		exclude: ['geojson'],
	},
	resolve: {
		alias: {
			// mitigation for ignoring package.json exports in @masterportal/masterportalapi
			'olcs/lib/olcs': resolve(
				__dirname,
				'..',
				'node_modules',
				'olcs',
				'lib',
				'olcs'
			),
			stream: require.resolve('stream-browserify'),
			timers: require.resolve('timers-browserify'),
		},
	},
})
