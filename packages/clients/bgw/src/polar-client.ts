import client from '@polar/core'
import packageInfo from '../package.json'
import addPlugins from './addPlugins'
import services from './services'
import mapConfiguration from './mapConfiguration'

// eslint-disable-next-line no-console
console.log(`BGW map client running in version ${packageInfo.version}.`)

addPlugins(client)

async function initializeClient() {
  client.rawLayerList.initializeLayerList(services)

  const instance = await client.createMap({
    containerId: 'render-node',
    mapConfiguration: {
      ...mapConfiguration,
      layerConf: services,
    },
  })

  // eslint-disable-next-line no-console
  console.log(instance)
}

initializeClient()
