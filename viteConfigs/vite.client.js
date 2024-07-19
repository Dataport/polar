import { createRequire } from 'module'
import { defineConfig } from 'vite'
import commonJs from 'vite-plugin-commonjs'
import vuePlugin from '@vitejs/plugin-vue2'

const require = createRequire(import.meta.url)

export default defineConfig({
  plugins: [commonJs(), vuePlugin()],
  root: 'src',
  define: {
    // disabled since that's its name and we have to deal with it
    // eslint-disable-next-line @typescript-eslint/naming-convention
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
      stream: require.resolve('stream-browserify'),
      timers: require.resolve('timers-browserify'),
    },
  },
})
