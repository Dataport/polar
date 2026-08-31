import type {
	Feature as GeoJsonFeature,
	LineString as GeoJsonLineString,
} from 'geojson'
import type { Map } from 'ol'
import type Feature from 'ol/Feature'
import type VectorSource from 'ol/source/Vector'

import { t } from 'i18next'

import { notifyUser } from '@/lib/notifyUser'

import { PluginId } from '../../../../types'
import {
	converter,
	cutCuttablesWithCutter,
	splitByCuttability,
} from './cutlery'
import { makeDraw } from './makeDraw'

// NOTE: Lots of "as" casting in whole module due to conversions' broad returns

const wgs84Epsg = 'EPSG:4326'

export const createCutInteractions = (map: Map, drawSource: VectorSource) => {
	const projectionInfo = {
		featureProjection: map.getView().getProjection().getCode(),
		dataProjection: wgs84Epsg,
	}
	const draw = makeDraw(projectionInfo, drawSource)
	draw.on('drawend', (e) => {
		const cutter = converter.writeFeatureObject(
			e.feature,
			projectionInfo
		) as GeoJsonFeature<GeoJsonLineString>
		const [cuttables, uncuttables] = splitByCuttability(
			drawSource,
			cutter,
			projectionInfo
		)

		if (cuttables.length) {
			try {
				const cuts = cutCuttablesWithCutter(cuttables, cutter).map(
					(cut) => converter.readFeature(cut, projectionInfo) as Feature
				)
				drawSource.clear()
				drawSource.addFeatures([...uncuttables, ...cuts])
			} catch {
				console.error(`Cut operation failed for unknown reason.`)
				notifyUser(
					'error',
					t(($) => $.cut.error.cutFailed, {
						ns: PluginId,
					})
				)
			}
		} else {
			notifyUser(
				'info',
				t(($) => $.cut.warn.unevenCut, {
					ns: PluginId,
				})
			)
		}
	})

	return draw
}
