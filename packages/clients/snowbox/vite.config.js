import { getClientConfig } from '../../../viteConfigs'

export default getClientConfig({
  base: '',
  define: {
    '__MOCK_MAP_URL__': JSON.stringify('http://127.0.0.1:3579'),
  },
  build: {
    lib: {
      entry: 'polar-client.ts',
      name: 'POLAR snowbox',
    },
  },
})
