import { getClientConfig } from '../../../viteConfigs'

export default getClientConfig({
  base: '',
  build: {
    lib: {
      name: 'PolarClientGeneric',
      entry: '../src/polar-client.ts',
      fileName: 'polar-client',
    },
  },
  root: 'example',
})
