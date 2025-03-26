import { defineConfig } from '@playwright/test'
import globalConfig from '../../../playwright.config'

const url = 'http://localhost:8080/'

export default defineConfig({
  ...globalConfig,
  use: {
    ...globalConfig.use,
    baseURL: url,
  },
  webServer: {
    ...globalConfig.webServer,
    command: 'cd ../../../ && npm run diplan:build:serve:e2e',
    reuseExistingServer: true,
    url,
  },
})
