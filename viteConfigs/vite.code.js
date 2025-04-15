import vuePlugin from '@vitejs/plugin-vue2'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vuePlugin()],
  build: {
    lib: {
      entry: 'src/index.ts',
    },
  },
})
