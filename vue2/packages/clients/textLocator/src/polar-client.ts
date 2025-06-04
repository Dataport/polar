import client from '@polar/core'
import packageInfo from '../package.json'
import { addPlugins, ids } from './addPlugins'
import { services as layerConf } from './services'
import { mapConfiguration } from './mapConfig'
import './styles.css'

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
  mapConfiguration.layerConf = layerConf
  mapConfiguration.addressSearch = {
    searchMethods: [
      {
        groupId: ids.groupId,
        categoryId: ids.categoryIdToponym,
        url: urls.gazetteerClient,
        type: ids.typeGazetteer,
      },
      {
        groupId: ids.groupId,
        categoryId: ids.categoryIdLiterature,
        url: urls.textLocatorBackend,
        type: ids.typeLiterature,
      },
    ],
    minLength: 3,
    waitMs: 500,
  }

  return await client.createMap({
    containerId,
    mapConfiguration: {
      ...mapConfiguration,
      geometrySearch: {
        url: urls.gazetteerClient,
      },
      textLocatorBackendUrl: urls.textLocatorBackend,
    },
  })
}
