import { Feature as GeoJsonFeature } from 'geojson'
import ImageLayer from 'ol/layer/Image'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import { rawLayerList } from '@masterportal/masterportalapi'
import { RequestGfiParameters } from '../types'

import requestGfiWms from './requestGfiWms'
import requestGfiWfs from './requestGfiWfs'
import requestGfiGeoJson from './requestGfiGeoJson'

/**
 * The requestGfi method abstracts from service-specific implementation and
 * retrieves feature information. Not all formats are supported yet.
 *
 * Namely, services returning any GML variant, or fitting text responses by
 * default, should work. All others are not yet implemented.
 * @param parameters - parameter object
 * @returns found features for GFI request
 */
export function requestGfi({
  map,
  layer,
  coordinateOrExtent,
  layerConfiguration,
  layerSpecification,
  mode,
}: RequestGfiParameters): Promise<GeoJsonFeature[]> {
  const layerId = layer.get('id')
  try {
    const params = {
      map,
      layerConfiguration,
      layerSpecification,
    }
    if (layer instanceof TileLayer || layer instanceof ImageLayer) {
      return coordinateOrExtent.length === 2
        ? requestGfiWms({
            ...params,
            coordinate: coordinateOrExtent,
            layer,
          })
        : Promise.reject(
            new Error(
              `An extent can not be used for ${layerId} as it is a WMS layer which only support coordinates for gfi requests.`
            )
          )
    }
    if (
      rawLayerList.getLayerWhere({ id: layerId })?.typ === 'GeoJSON' &&
      // NOTE: This is the case by design of @masterportal/masterportalapi but is added here for type safety
      layer instanceof VectorLayer
    ) {
      return requestGfiGeoJson({ ...params, coordinateOrExtent, layer })
    }
    if (layer instanceof VectorLayer) {
      return requestGfiWfs({ ...params, coordinateOrExtent, mode })
    }
    const notImplemented = `Layer ${layerId} was neither a Tile- nor a VectorLayer. GFI not implemented.`
    return Promise.reject(new Error(notImplemented))
  } catch (e) {
    const error = `An error occurred while requesting features from layer with the id ${layerId}.`
    return Promise.reject(new Error(error))
  }
}
