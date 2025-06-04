import { LayerConfiguration } from '@polar/lib-custom-types'
import { IdManipulator } from '../types'

/**
 * Returns a boolean list which contains the attributions for every visible Layer
 * @param layers - layers carry setup information
 * @param zoom - the zoom the map is currently in
 * @returns information about layer active property.
 */
export function areLayersActive(
  layers: LayerConfiguration[],
  zoom: number
): LayerConfiguration[] {
  return layers.filter((layer) => {
    let { minZoom, maxZoom } = layer
    if (typeof minZoom === 'undefined') minZoom = 0
    if (typeof maxZoom === 'undefined') maxZoom = Number.MAX_SAFE_INTEGER
    return minZoom <= zoom && zoom <= maxZoom
  })
}

/**
 * Returns the return value of the given callback, which takes the extracted list of layer ids
 * @param layers - layers carry setup information
 * @param callback - can be used to make the created list available, but with a local scope;
 *  can also be used to manipulate the list of ids, before returning it
 * @returns list of id properties, if not manipulated by callback.
 */
export function asIdList(
  layers: LayerConfiguration[],
  callback: IdManipulator = (ids) => ids
) {
  const ids: string[] = layers.map(({ id }) => String(id))
  return callback(ids)
}
