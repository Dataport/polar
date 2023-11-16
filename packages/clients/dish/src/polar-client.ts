import client from '@polar/core'
import packageInfo from '../package.json'
import { navigateToDenkmal } from './utils/navigateToDenkmal'
import { addPlugins } from './addPlugins'
import { services as layerConf } from './services'
import { mapConfiguration } from './mapConfig'
import { CONTENT_ENUM } from './plugins/Modal/store'
import './styles.css'

// eslint-disable-next-line no-console
console.log(`DISH map client running in version ${packageInfo.version}.`)

addPlugins(client)

const containerId = 'polarstern'

async function initializeClient() {
  client.rawLayerList.initializeLayerList(layerConf)

  const instance = await client.createMap({
    containerId,
    mapConfiguration: {
      ...mapConfiguration,
      layerConf,
    },
  })

  const parameters = new URL(document.location as unknown as string)
    .searchParams
  // using naming from backend to avoid multiple names for same thing
  const objektId = parameters.get('ObjektID')

  if (typeof objektId === 'string') {
    navigateToDenkmal(instance, objektId)
  }

  // @ts-expect-error | intentionally expand window; no environment affected
  window.openBenutzungshinweise = function () {
    instance.$store.commit('plugin/modal/setContent', CONTENT_ENUM.HINTS)
    instance.$store.commit('plugin/modal/setClosed', false)
  }
}

initializeClient()
