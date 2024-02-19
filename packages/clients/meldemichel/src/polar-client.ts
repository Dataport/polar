import core, { NineLayoutTag } from '@polar/core'
import merge from 'lodash.merge'
import { Vector } from 'ol/layer'
import { Map } from 'ol'
import Source from 'ol/source/Vector'
import { MapInstance } from '@polar/core/src/types'
import packageInfo from '../package.json'
import { MODE } from './enums'
import { addPlugins } from './addPlugins'
import { getMapConfiguration, hamburgBorder } from './mapConfigurations'
import { setBackgroundImage } from './utils/setBackgroundImage'
import { MeldemichelCreateMapParams } from './types'
import meldemichelModule from './store/module'
import './styles/index.css'
import AfmButton from './plugins/AfmButton'
import { enableClustering } from './utils/enableClustering'

// eslint-disable-next-line no-console
console.log(`POLAR Meldemichel loaded in version ${packageInfo.version}.`)

const serviceRegister =
  'https://geoportal-hamburg.de/lgv-config/services-internet.json'

// can't be configured "visible: false" – wouldn't load at all then
const hideHamburgBorder = (map: Map) => {
  ;(
    map
      .getLayers()
      .getArray()
      .find((layer) => layer.get('id') === hamburgBorder) as Vector<Source>
  ).setStyle(null)
}

const registerAfmButton = (client, mode) => {
  if (mode === MODE.COMPLETE) {
    // late setup due to dependency to meldemichelModule
    AfmButton({
      displayComponent: true,
      layoutTag: NineLayoutTag.BOTTOM_RIGHT,
    })(client)
  }
}

const memory: {
  wrapper: HTMLElement | null
  client: MapInstance | null
} = {
  wrapper: null,
  client: null,
}

const rerender = (containerId, configOverride) => {
  document
    .getElementById(containerId)
    ?.replaceWith(memory.wrapper as HTMLElement)
  if (configOverride.pins && memory.client) {
    // update may be required on rerender
    const client = memory.client
    client.$store.commit('setConfiguration', {
      ...client.$store.state.configuration,
      pins: configOverride.pins,
    })
    client.$store.dispatch('plugin/pins/setupInitial')
  }
  return memory.client
}

export default {
  createMap: ({
    containerId,
    mode,
    afmUrl,
    reportServiceId,
    configOverride,
  }: MeldemichelCreateMapParams) =>
    new Promise((resolve) => {
      if (memory.wrapper) {
        return resolve(rerender(containerId, configOverride))
      }

      if (!Object.keys(MODE).includes(mode)) {
        console.error(
          `@polar/client-meldemichel: Critical error. Unknown mode "${mode}" configured. Please use 'COMPLETE', 'REPORT', or 'SINGLE'.`
        )
      }

      const meldemichelCore = { ...core }
      addPlugins(meldemichelCore, mode)

      // NOTE initializeLayerList is async in this scenario
      meldemichelCore.rawLayerList.initializeLayerList(
        serviceRegister,
        async (layerConf) => {
          enableClustering(layerConf, reportServiceId)

          const client = await meldemichelCore.createMap({
            containerId,
            mapConfiguration: merge(
              {
                ...getMapConfiguration({ mode, afmUrl, reportServiceId }),
                layerConf,
              },
              configOverride || {}
            ),
          })

          client.$store.registerModule('meldemichel', meldemichelModule)
          registerAfmButton(client, mode)
          hideHamburgBorder(client.$store.getters.map)
          setBackgroundImage(containerId)

          memory.wrapper = document.getElementById(`${containerId}-wrapper`)
          memory.client = client

          resolve(client)
        }
      )
    }),
}
