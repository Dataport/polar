import { MapInstance } from '@polar/core'
import { SearchMethodConfiguration } from '@polar/lib-custom-types'
import { categoryIdAlkisSearch } from '../mapConfigurations/searchConfigParams'
import { alkisWms } from '../servicesConstants'
import { alkisMinZoom } from '../mapConfigurations/layerConfigIntern'

export function watchSearchResultForAlkisSearch(instance: MapInstance) {
  instance.subscribe('plugin/addressSearch/chosenAddress', (chosenAddress) => {
    if (chosenAddress === null) {
      return
    }
    if (chosenAddress.properties?.idflurst) {
      const zoomLevel = instance.$store.getters['plugin/zoom/zoomLevel']

      if (zoomLevel <= alkisMinZoom) {
        instance.$store.getters.map
          .getView()
          .setZoom(alkisMinZoom)
      }

      const activeMaskIds =
        instance.$store.getters['plugin/layerChooser/activeMaskIds']
      if (!activeMaskIds.includes(alkisWms)) {
        instance.$store.dispatch(
          'plugin/layerChooser/setActiveMaskIds',
          [...activeMaskIds, alkisWms]
        )
      }
    }
  })
}
