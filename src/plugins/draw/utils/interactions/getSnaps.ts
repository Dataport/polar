import type { Map } from 'ol'
import type VectorLayer from 'ol/layer/Vector'
import type { DisposableInteraction } from '../../types'

import { Snap } from 'ol/interaction'
import VectorSource from 'ol/source/Vector'

export const getSnaps = (map: Map, snapIds: string[]) =>
	snapIds.reduce<DisposableInteraction[]>((accumulator, layerId) => {
		const layer = map
			.getLayers()
			.getArray()
			.find((layer) => layer.get('id') === layerId) as VectorLayer
		const source = layer.getSource()
		if (source instanceof VectorSource) {
			const snap = new Snap({ source })
			const visibilityToggler = () => {
				snap.setActive(layer.getVisible())
			}
			layer.on('propertychange', visibilityToggler)
			visibilityToggler()
			accumulator.push({
				interaction: snap,
				dispose: () => {
					layer.un('propertychange', visibilityToggler)
				},
			})
		} else {
			console.warn(
				`Layer with ID "${layerId}" configured for 'snapTo', but it has no source to snap to. The layer does probably not hold any vector data.`
			)
		}
		return accumulator
	}, [])
