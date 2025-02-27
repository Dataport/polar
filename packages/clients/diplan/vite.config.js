import { getClientConfig } from '../../../viteConfigs'

export default getClientConfig({
  root: 'example',
  build: {
    outDir: '../dist',
    lib: {
      name: 'PolarClientDiPlan',
      entry: '../src/polar-client.ts',
      fileName: () => 'polar-client.js',
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.name === 'style.css' ? 'polar-client.css' : assetInfo.name,
      },
    },
  },
})
