import client from '@polar/core'
import packageInfo from '../package.json'
import addPlugins from './addPlugins'
import services from './services'
import mapConfiguration from './mapConfiguration'

// eslint-disable-next-line no-console
console.info(`@polar/client-bgw: running in v${packageInfo.version}.`)

const containerId = 'polarstern'
addPlugins(client)

async function initializeClient() {
  client.rawLayerList.initializeLayerList(services)

  await client.createMap({
    containerId,
    mapConfiguration: {
      ...mapConfiguration,
      layerConf: services,
    },
  })
}

initializeClient()
