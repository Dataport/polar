import type { Feature, Map } from 'ol'
import type { FeatureLike } from 'ol/Feature'
import type VectorLayer from 'ol/layer/Vector'
import type {
	MapConfiguration,
	MasterportalApiServiceRegister,
} from '../../types'

import { setCustomStyles } from '@masterportal/masterportalapi/src/layer/geojson'
import createStyle from '@masterportal/masterportalapi/src/vectorStyle/createStyle'
import styleList from '@masterportal/masterportalapi/src/vectorStyle/styleList'
import noop from '@repositoryname/noop'

import { styles } from './olDefaultStyle'

const changeMasterportalApiDefaults = () => {
	setCustomStyles({
		// required by masterportalAPI
		/* eslint-disable @typescript-eslint/naming-convention */
		Point: styles,
		LineString: styles,
		MultiLineString: styles,
		MultiPoint: styles,
		MultiPolygon: styles,
		Polygon: styles,
		GeometryCollection: styles,
		Circle: styles,
		/* eslint-enable @typescript-eslint/naming-convention */
	})
}

export async function setupStyling(
	map: Map,
	configuration: MapConfiguration,
	register: MasterportalApiServiceRegister
) {
	changeMasterportalApiDefaults()
	if (configuration.featureStyles && Array.isArray(register)) {
		await styleList.initializeStyleList(
			// Masterportal specific field not required by POLAR
			{},
			{ styleConf: configuration.featureStyles },
			configuration.layers.map((layer) => {
				const layerConfig = register.find((l) => l.id === layer.id)
				if (layerConfig) {
					return {
						...layer,
						// Required by @masterportal/masterportalapi
						typ: layerConfig.typ,
					}
				}
				return layer
			}),
			// Masterportal specific field not required by POLAR
			[],
			// Callback currently yields no relevant benefit
			noop
		)
		// A layer can either be styled through the provided styles or through the markers configuration; markers takes precedence.
		const markerLayers = configuration.markers
			? configuration.markers.layers.map(({ id }) => id)
			: []
		map
			.getLayers()
			.getArray()
			.filter(
				(layer) =>
					typeof layer.get('styleId') === 'string' &&
					!markerLayers.includes(layer.get('id') as string)
			)
			.forEach((layer) => {
				const styleObject = styleList.returnStyleObject(layer.get('styleId'))
				if (styleObject) {
					;(layer as VectorLayer).setStyle((feature: Feature | FeatureLike) =>
						createStyle.createStyle(
							styleObject,
							feature,
							feature.get('features') !== undefined,
							// NOTE: This field may be implemented in the future to be able to style points with graphics
							''
						)
					)
				}
			})
	}
}
