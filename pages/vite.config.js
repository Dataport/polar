import { getClientConfig } from '../viteConfigs'

export default getClientConfig({
  root: '.',
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
  },
  build: {
    outDir: '../pages_output',
  },
})
