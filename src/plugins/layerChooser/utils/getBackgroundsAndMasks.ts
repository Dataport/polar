import { rawLayerList } from '@masterportal/masterportalapi'

import type { LayerConfiguration } from '@/core'

export const getBackgroundsAndMasks = (
	layers: LayerConfiguration[]
): [LayerConfiguration[], LayerConfiguration[]] =>
	layers.reduce(
		([backgrounds, masks], current) => {
			const rawLayer = rawLayerList.getLayerWhere({
				id: current.id,
			})

			if (rawLayer === null) {
				console.error(
					`Layer ${current.id} not found in service register. This is a configuration issue. The map might behave in unexpected ways.`,
					current
				)
				return [backgrounds, masks]
			}

			return current.type === 'background'
				? [[...backgrounds, current], masks]
				: [backgrounds, [...masks, current]]
		},
		[[] as LayerConfiguration[], [] as LayerConfiguration[]]
	)
