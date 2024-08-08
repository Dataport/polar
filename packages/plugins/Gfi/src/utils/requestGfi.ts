import { Feature as GeoJsonFeature } from 'geojson'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
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
  coordinate,
  layerConfiguration,
  layerSpecification,
  mode,
}: RequestGfiParameters): Promise<GeoJsonFeature[]> {
  try {
    const params = { map, coordinate, layerConfiguration, layerSpecification }
    if (layer instanceof TileLayer) {
      return requestGfiWms({ ...params, layer })
    }
    if (
      rawLayerList.getLayerWhere({ id: layer.get('id') })?.typ === 'GeoJSON'
    ) {
      return requestGfiGeoJson({ ...params, layer })
    }
    if (layer instanceof VectorLayer) {
      return requestGfiWfs({ ...params, mode })
    }
    return Promise.reject(
      new Error(
        `Layer ${layer.get(
          'id'
        )} was neither a Tile- nor a VectorLayer. GFI not implemented.`
      )
    )
  } catch (e) {
    return Promise.reject(
      new Error(
        `An error occurred while requesting features from layer with the id ${layer.get(
          'id'
        )}.`
      )
    )
  }
}
