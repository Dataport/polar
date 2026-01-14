import { MapInstance } from '@polar/core'
import { categoryIdAlkisSearch } from '../mapConfigurations/searchConfigParams'

export function watchSearchResultForAlkisSearch(instance: MapInstance) {
  instance.subscribe('plugin/addressSearch/chosenAddress', (chosenAddress) => {
    if (chosenAddress === null) {
      return
    }
    const configuration =
      instance.$store.getters['plugin/addressSearch/addressSearchConfiguration']
    const configPatternKeys = configuration.searchMethods?.find(
      (method) => method.categoryId === categoryIdAlkisSearch
    ).queryParameters?.patternKeys
    const configPatternKeysArray = Object.keys(configPatternKeys || {})
    const patternKeysSearchResult = Object.keys(
      (chosenAddress as any)?.properties || {}
    )

    if (
      configPatternKeysArray.every((item) =>
        patternKeysSearchResult.includes(item)
      )
    ) {
      console.log('### ES KLAPPT')
    }
  })
}
