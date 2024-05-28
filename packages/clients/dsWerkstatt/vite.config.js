import { getClientConfig } from '../../../viteConfigs'

export default getClientConfig({
  build: {
    lib: {
      name: 'POLAR Client',
      entry: '../src/polar-client.ts',
      fileName: 'polar-client',
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.name === 'style.css' ? 'polar-client.css' : assetInfo.name,
      },
    },
  },
})
