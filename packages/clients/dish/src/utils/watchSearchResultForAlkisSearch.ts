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
    const configuration =
      instance.$store.getters['plugin/addressSearch/addressSearchConfiguration']
    const configPatternKeys = configuration.searchMethods?.find(
      (method: SearchMethodConfiguration) =>
        method.categoryId === categoryIdAlkisSearch
    ).queryParameters?.patternKeys
    const configPatternKeysArray = Object.keys(configPatternKeys || {})
    const patternKeysSearchResult = Object.keys(
      (chosenAddress as { properties?: Record<string, unknown> })?.properties ||
        {}
    )

    if (
      configPatternKeysArray.every((item) =>
        patternKeysSearchResult.includes(item)
      )
    ) {
      const zoomLevel = instance.$store.getters['plugin/zoom/zoomLevel']
      if (zoomLevel < alkisMinZoom) {
        instance.$store.getters.map.getView().setZoom(alkisMinZoom)
      }
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
