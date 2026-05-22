import type {
	Feature as GeoJsonFeature,
	LineString as GeoJsonLineString,
} from 'geojson'
import type Feature from 'ol/Feature'
import type LineString from 'ol/geom/LineString'
import type VectorSource from 'ol/source/Vector'
import type { ProjectionInfo } from './types'

import Draw from 'ol/interaction/Draw'

import { converter, splitByCuttability } from './cutlery'
import { cutStyle, styleCut } from './style'

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
