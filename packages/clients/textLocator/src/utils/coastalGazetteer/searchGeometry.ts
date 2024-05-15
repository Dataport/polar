import { Feature } from 'ol'
import { CoreGetters, CoreState, PolarStore } from '@polar/lib-custom-types'
import { FeatureCollection } from 'geojson'
import { getAllPages } from './getAllPages'
import { geoJson } from './common'
import { ResponsePayload } from './types'
import {
  featureCollectionify,
  getEmptyFeatureCollection,
} from './responseInterpreter'

let abortController: AbortController | null = null

export async function searchGeometry(
  this: PolarStore<CoreState, CoreGetters>,
  feature: Feature,
  url: string,
  epsg: `EPSG:${string}`
): Promise<FeatureCollection> | never {
  if (abortController) {
    abortController.abort()
  }
  const geometry = feature.getGeometry()
  if (!geometry) {
    return getEmptyFeatureCollection()
  }
  abortController = new AbortController()
  const signal = abortController.signal
  let fullResponse: ResponsePayload
  try {
    fullResponse = await getAllPages.call(
      this,
      signal,
      url,
      { geometry: geoJson.writeGeometryObject(geometry) },
      epsg
    )
  } catch (e) {
    if (!signal.aborted) {
      console.error(e)
      this.dispatch('plugin/toast/addToast', {
        type: 'error',
        text: 'textLocator.error.searchCoastalGazetteer',
      })
    }
    return getEmptyFeatureCollection()
  }
  abortController = null
  return Promise.resolve(featureCollectionify(fullResponse, epsg, null))
}
