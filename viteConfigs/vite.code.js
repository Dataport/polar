import { defineConfig } from 'vite'
import vuePlugin from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [vuePlugin()],
  build: {
    lib: {
      entry: 'src/index.ts',
    },
  },
})
