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
    textLocatorBackend: string
    gazetteerClient: string
  }
}

export async function initializeClient({ urls }: TextLocatorParameters) {
  client.rawLayerList.initializeLayerList(layerConf)
  mapConfiguration.layerConf = layerConf
  mapConfiguration.addressSearch = {
    searchMethods: [{ url: urls.gazetteerClient, type: 'coastalGazetteer' }],
    minLength: 3,
    waitMs: 500,
  }
  // @ts-expect-error | local addition
  mapConfiguration.geometrySearch = {
    url: urls.gazetteerClient,
  }
  // @ts-expect-error | local addition
  mapConfiguration.textLocatorBackendUrl = urls.textLocatorBackend

  return await client.createMap({
    containerId,
    mapConfiguration,
  })
}
