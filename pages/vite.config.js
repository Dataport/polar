import { getClientConfig } from '../viteConfigs'

export default getClientConfig({
  base: '',
  root: '.',
  build: {
    outDir: '../pages_output',
  },
})
