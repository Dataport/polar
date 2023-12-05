import core, { NineLayoutTag } from '@polar/core'
import merge from 'lodash.merge'
import { Vector } from 'ol/layer'
import { Map } from 'ol'
import Source from 'ol/source/Vector'
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

export default {
  ...core,
  // TODO API is probably not complete; worked out as part of project
  // how do we identify which marker is moved? by coordinate?
  // movable = false // NOTE relevant for SINGLE mode later – map to Pins config
  createMap: ({
    containerId,
    mode,
    afmUrl,
    reportServiceId,
    configOverride,
  }: MeldemichelCreateMapParams) =>
    new Promise((resolve) => {
      if (!Object.keys(MODE).includes(mode)) {
        console.error(
          `POLAR Meldemichel: Critical error. Unknown mode "${mode}" configured. Please use 'COMPLETE', 'REPORT', or 'SINGLE'.`
        )
      }

      addPlugins(core, mode)

      // NOTE initializeLayerList is async in this scenario
      core.rawLayerList.initializeLayerList(
        serviceRegister,
        async (layerConf) => {
          enableClustering(layerConf, reportServiceId)
          const client = await core.createMap({
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

          if (mode === MODE.COMPLETE) {
            // late setup due to dependency to meldemichelModule
            AfmButton({
              displayComponent: true,
              layoutTag: NineLayoutTag.BOTTOM_RIGHT,
            })(client)
          }

          hideHamburgBorder(client.$store.getters.map)
          setBackgroundImage(containerId)

          resolve(client)
        }
      )
    }),
}
