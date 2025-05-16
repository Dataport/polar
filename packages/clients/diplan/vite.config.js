import { getClientConfig } from '../../../viteConfigs'

export default getClientConfig({
  build: {
    lib: {
      entry: 'polar-client.ts',
      name: 'PolarClientDiPlan',
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.name === 'style.css' ? 'polar-client.css' : assetInfo.name,
      },
    },
  },
})
