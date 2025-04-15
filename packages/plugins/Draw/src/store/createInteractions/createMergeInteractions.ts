import { PolarActionContext } from '@polar/lib-custom-types'
import { getSnaps } from '@polar/plugin-draw'
import { booleanIntersects } from '@turf/boolean-intersects'
import { union } from '@turf/union'
import { Feature as GeoJsonFeature, MultiPolygon, Polygon } from 'geojson'
import Feature from 'ol/Feature'
import { GeoJSON } from 'ol/format'
import Draw from 'ol/interaction/Draw'
import Snap from 'ol/interaction/Snap'
import { CreateInteractionsPayload, DrawGetters, DrawState } from '../../types'

const converter = new GeoJSON()

export const createMergeInteractions = (
  { rootGetters }: PolarActionContext<DrawState, DrawGetters>,
  { drawSource }: CreateInteractionsPayload
) => {
  const draw = new Draw({ type: 'Polygon' })
  // @ts-expect-error | internal hack to detect it in @polar/plugin-pins and @polar/plugin-gfi
  draw._isDrawPlugin = true

  draw.on('drawend', (e) => {
    const mergePolygon = converter.writeFeatureObject(
      e.feature
    ) as GeoJsonFeature<Polygon>
    const drawFeatures = drawSource.getFeatures()

    // sort everything into a.) things to combine b.) things not to touch
    const intersectedPolygons: GeoJsonFeature<Polygon | MultiPolygon>[] = []
    const nextFeatures = drawFeatures.reduce((accumulator, drawFeature) => {
      const type = drawFeature.getGeometry()?.getType() ?? ''
      const drawFeatureAsGeoJson = converter.writeFeatureObject(drawFeature)
      if (
        ['Polygon', 'MultiPolygon'].includes(type) &&
        booleanIntersects(mergePolygon, drawFeatureAsGeoJson)
      ) {
        intersectedPolygons.push(
          drawFeatureAsGeoJson as GeoJsonFeature<Polygon | MultiPolygon>
        )
      } else {
        accumulator.push(drawFeature)
      }
      return accumulator
    }, [] as Feature[])

    const mergedFeature = union({
      type: 'FeatureCollection',
      features: [mergePolygon, ...intersectedPolygons],
    })

    nextFeatures.push(converter.readFeature(mergedFeature) as Feature)

    drawSource.clear()
    drawSource.addFeatures(nextFeatures)
  })

  return [
    draw,
    ...getSnaps(rootGetters.map, rootGetters.configuration?.draw?.snapTo || []),
    new Snap({ source: drawSource }),
  ]
}
