/* eslint-disable no-console */
import { initializeClient } from './client-text-locator.js'

const config = {
  urls: {
    textLocatorBackend: 'https://textlocator.ai.dsecurecloud.de/api',
    gazetteerClient: 'https://mdi-de-dienste.org/GazetteerClient/search',
  },
}

initializeClient(config)
  .then(console.info.bind(null, 'Map client instance:'))
  .catch(console.error.bind(null, 'Map client setup failed:'))
