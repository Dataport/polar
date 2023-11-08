import { getClientConfig } from '../viteConfigs'

export default getClientConfig({
  root: '.',
  build: {
    outDir: '../pages_output',
  },
})
