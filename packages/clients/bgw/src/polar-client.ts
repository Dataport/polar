import client from '@polar/core'
import addPlugins from './addPlugins'
import packageInfo from '../package.json'
import services from './services'
import mapConfiguration from './mapConfiguration'


// eslint-disable-next-line no-console
console.info(`@polar/client-bgw: running in v${packageInfo.version}.`)

const containerId = 'polarstern'
addPlugins(client)


async function initializeClient() {
	client.rawLayerList.initializeLayerList(services)
  
	const instance = await client.createMap({
	  containerId,
	  mapConfiguration: {
		...mapConfiguration,
		services,
	  },
	})
}

initializeClient()