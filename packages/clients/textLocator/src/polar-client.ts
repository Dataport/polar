import client from '@polar/core'
import packageInfo from '../package.json'
import { addPlugins } from './addPlugins'
import { services as layerConf } from './services'
import { mapConfiguration } from './mapConfig'

// eslint-disable-next-line no-console
console.log(`TextLocator map client running in version ${packageInfo.version}.`)
const containerId = 'polarstern'
addPlugins(client)

interface TextLocatorParameters {
  urls: {
    backend: string
    gazetteerClient: string
    gazetteerWfs: string
  }
}

export async function initializeClient({ urls }: TextLocatorParameters) {
  client.rawLayerList.initializeLayerList(layerConf)
  mapConfiguration.layerConf = layerConf
  mapConfiguration.addressSearch = {
    // @ts-expect-error | rest configured in addPlugins.ts (simple API)
    searchMethods: [{ url: urls.gazetteerClient }],
  }

  return await client.createMap({
    containerId,
    mapConfiguration,
  })
}
