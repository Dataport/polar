import { CoreGetters, CoreState, PolarStore } from '@polar/lib-custom-types'
import { FeatureCollection } from 'geojson'
import { TitleLocationFrequency } from '../../../types'
import urlSuffix from '../urlSuffix'

const mapResponseToFeatureCollection = (
  titleLocationFrequency: TitleLocationFrequency
): FeatureCollection => ({
  type: 'FeatureCollection',
  features: Object.entries(titleLocationFrequency).map(
    ([literatureId, { title, location_frequency: locationFrequency }]) => ({
      type: 'Feature',
      // fake geom to fit APIs; ignored by custom selectLiterature
      geometry: { type: 'Point', coordinates: [0, 0] },
      properties: locationFrequency,
      epsg: null,
      id: literatureId,
      title,
    })
  ),
})

export function searchLiterature(
  this: PolarStore<CoreState, CoreGetters>,
  signal: AbortSignal,
  url: string,
  inputValue: string
): Promise<FeatureCollection> {
  return fetch(`${url}${urlSuffix.findDocumentsByTitle}`, {
    method: 'POST',
    headers: {
      // NOTE required by API
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ search_word: `${inputValue}*` }),
    signal,
  })
    .then(async (response): Promise<TitleLocationFrequency> => {
      if (response.ok) {
        return ((await response.json()).title_location_freq ||
          {}) as TitleLocationFrequency
      }
      throw response
    })
    .then((titleLocationFrequency) =>
      mapResponseToFeatureCollection(titleLocationFrequency)
    )
    .catch((error) => {
      // if not intentional ("operation was aborted" = "user types more")
      if (!signal.aborted) {
        console.error(error)
        this.dispatch('plugin/toast/addToast', {
          type: 'warning',
          text: 'common:textLocator.error.search',
        })
      }

      const emptyFeatureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      }

      return emptyFeatureCollection
    })
}
