import { getClientConfig } from '../../../viteConfigs'

export default getClientConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: 'polar-client.ts',
      name: 'POLAR Meldemichel Client',
    },
  },
})
