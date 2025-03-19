import Draw from 'ol/interaction/Draw'
import LineString from 'ol/geom/LineString'
import Feature from 'ol/Feature'
import {
  Feature as GeoJsonFeature,
  LineString as GeoJsonLineString,
} from 'geojson'
import VectorSource from 'ol/source/Vector'
import { cutStyle, styleCut } from './style'
import { ProjectionInfo } from './types'
import { converter, splitByCuttability } from './cutlery'

export const makeDraw = (
  projectionInfo: ProjectionInfo,
  drawSource: VectorSource
) =>
  new Draw({
    type: 'LineString',
    stopClick: true,
    style: (feature) => {
      const cutter = converter.writeFeatureObject(
        feature as Feature<LineString>,
        projectionInfo
      ) as GeoJsonFeature<GeoJsonLineString>
      // if cut would have an effect, style accordingly
      styleCut(
        splitByCuttability(drawSource, cutter, projectionInfo)[0].length > 0
      )
      return cutStyle
    },
  })
