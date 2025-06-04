import { getClientConfig } from '../../../viteConfigs'

export default getClientConfig({
  base: '',
  build: {
    lib: {
      name: 'PolarClientGeneric',
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
  root: 'example',
})
