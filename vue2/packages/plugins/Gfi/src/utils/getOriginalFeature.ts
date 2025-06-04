import { GeoJSON } from 'ol/format'
import { Geometry } from 'ol/geom'
import { Feature } from 'ol'
import compare from 'just-compare'
import { isVisible } from '@polar/lib-invisible-style'
import { GeoJsonProperties } from 'geojson'
import VectorSource from 'ol/source/Vector'

export const getOriginalFeature = (
  sources: VectorSource<Feature<Geometry>>[],
  properties: GeoJsonProperties
) =>
  sources
    .map((source) =>
      source
        .getFeatures()
        .filter(isVisible)
        .map((feature) => {
          // true = silent change (prevents cluster recomputation & rerender)
          feature.set('_gfiLayerId', source.get('_gfiLayerId'), true)
          return feature
        })
    )
    .flat(1)
    .find((f) =>
      compare(JSON.parse(new GeoJSON().writeFeature(f)).properties, properties)
    )
