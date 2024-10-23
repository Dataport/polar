import client from '@polar/core'
import merge from 'lodash.merge'
import packageInfo from '../package.json'
import { navigateToDenkmal } from './utils/navigateToDenkmal'
import { addPlugins } from './addPlugins'
import { denkmaelerWfsServiceIntern, services } from './services'
import { getMapConfiguration } from './mapConfig'
import { CONTENT_ENUM } from './plugins/Modal/store'
import './styles.css'
import { zoomToFeatureById } from './utils/zoomToFeatureById'

// eslint-disable-next-line no-console
console.log(`DISH map client running in version ${packageInfo.version}.`)

export default {
  createMap: async ({ containerId, mode, configOverride }) => {
    addPlugins(client, mode)
    const layerConf = services(mode)
    client.rawLayerList.initializeLayerList(layerConf)
    const mapConfiguration = getMapConfiguration(mode)

    const instance = await client.createMap({
      containerId,
      mapConfiguration: merge(
        {
          ...mapConfiguration,
          layerConf,
        },
        configOverride || {}
      ),
    })

    const parameters = new URL(document.location as unknown as string)
      .searchParams
    // using naming from backend to avoid multiple names for same thing
    const objektId = parameters.get('ObjektID')

    if (typeof objektId === 'string' && mode === 'INTERN') {
      zoomToFeatureById(instance, objektId, denkmaelerWfsServiceIntern.url, {
        fieldName: 'objektid',
        featurePrefix: 'app',
        typeName: 'TBLGIS_ORA',
        xmlns: 'http://www.deegree.org/app',
        useRightHandWildcard: false,
      })
    }

    if (typeof objektId === 'string' && mode === 'EXTERN') {
      navigateToDenkmal(instance, objektId)
    }

    // @ts-expect-error | intentionally expand window; no environment affected
    window.openBenutzungshinweise = function () {
      instance.$store.commit('plugin/modal/setContent', CONTENT_ENUM.HINTS)
      instance.$store.commit('plugin/modal/setClosed', false)
    }
  },
}
