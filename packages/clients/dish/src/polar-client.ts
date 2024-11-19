/* eslint-disable max-lines-per-function */
import client from '@polar/core'
import merge from 'lodash.merge'
import packageInfo from '../package.json'
import { navigateToDenkmal } from './utils/navigateToDenkmal'
import { addPlugins } from './addPlugins'
import { services } from './services'
import { getMapConfiguration } from './mapConfig'
import { CONTENT_ENUM } from './plugins/Modal/store'
import './styles.css'
import { zoomToFeatureById } from './utils/zoomToFeatureById'

// eslint-disable-next-line no-console
console.log(`DISH map client running in version ${packageInfo.version}.`)

export default {
  createMap: async ({ containerId, mode, urlParams, configOverride }) => {
    const internServicesBaseUrl = `${urlParams.internalHost}${urlParams.internalPort}/${urlParams.internalPath}`
    addPlugins(client, mode)
    const layerConf = services(mode, internServicesBaseUrl)
    client.rawLayerList.initializeLayerList(layerConf)
    const mapConfiguration = getMapConfiguration(mode, internServicesBaseUrl)

    const instance = await client
      .createMap({
        containerId,
        mapConfiguration: merge(
          {
            ...mapConfiguration,
            layerConf,
          },
          configOverride || {}
        ),
      })
      .then((map) => {
        const parameters = new URL(document.location as unknown as string)
          .searchParams
        // using naming from backend to avoid multiple names for same thing
        const objektId = parameters.get('ObjektID')
        if (mode === 'INTERN') {
          map.subscribe('plugin/export/exportedMap', (screenshot) => {
            if (screenshot) {
              const newWindow = window.open()
              newWindow?.document.write(
                `<img src="${screenshot}" alt="Screenshot">`
              )
            }
          })
          if (typeof objektId === 'string') {
            zoomToFeatureById(map, objektId, urlParams.denkmaelerWfsInternUrl, {
              fieldName: 'objektid',
              featurePrefix: 'app',
              typeName: 'TBLGIS_ORA',
              xmlns: 'http://www.deegree.org/app',
              useRightHandWildcard: false,
            })
          }
        } else if (typeof objektId === 'string' && mode === 'EXTERN') {
          navigateToDenkmal(map, objektId)
        }
        // @ts-expect-error | intentionally expand window; no environment affected
        window.openBenutzungshinweise = function (isIntern = false) {
          map.$store.commit(
            'plugin/modal/setContent',
            isIntern ? CONTENT_ENUM.HINTSINTERN : CONTENT_ENUM.HINTS
          )
          map.$store.commit('plugin/modal/setClosed', false)
        }
      })
  },
}
