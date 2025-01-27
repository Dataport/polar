import { getClientConfig } from '../../../viteConfigs'

export default getClientConfig({
    build: {
      lib: {
        entry: 'polar-client.ts',
        name: 'POLAR Badegewässer Client',
      },
    },
  })
