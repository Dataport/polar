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

      instance.$store.getters.map
        .getView()
        .setZoom(zoomLevel <= alkisMinZoom ? alkisMinZoom : zoomLevel)

      const activeMaskIds =
        instance.$store.getters['plugin/layerChooser/activeMaskIds']
      if (!activeMaskIds.includes(alkisWms)) {
        activeMaskIds.push(alkisWms)
        instance.$store.dispatch(
          'plugin/layerChooser/setActiveMaskIds',
          activeMaskIds
        )
      }
    }
  })
}
