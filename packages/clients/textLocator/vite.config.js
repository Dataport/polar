import { getClientConfig } from '../../../viteConfigs'

export default getClientConfig({
  base: '',
  build: {
    lib: {
      entry: 'polar-client.ts',
      name: 'POLAR TextLocator Client',
    },
  },
})
