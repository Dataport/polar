import { layerLib, rawLayerList } from '@masterportal/masterportalapi'
import { toMerged } from 'es-toolkit'

import type { LayerConfiguration } from '@/core'

import type { LayerLegend } from '../types'

export const prepareLegends = (
	layers: LayerConfiguration[]
): Record<string, LayerLegend> =>
	layers
		.map(({ id, name }) => ({ id, name }))
		.map((layer) =>
			toMerged(layer, {
				rawLayer: rawLayerList.getLayerWhere({ id: layer.id }),
			})
		)
		.filter(({ rawLayer }) => rawLayer !== null)
		.reduce((acc, layer) => {
			const url = layerLib.getLegendURLs(layer.rawLayer)[0]
			return typeof url === 'string'
				? { ...acc, [layer.id]: { name: layer.name, url } }
				: acc
		}, {})
