import { Feature, Overlay, type MapBrowserEvent } from 'ol'

import { getTooltip } from '@/lib/tooltip'

export function updateTooltip(
	{ pixel, dragging, originalEvent, map }: MapBrowserEvent,
	overlay: Overlay,
	tooltipGenerators: Record<string, (feature: Feature) => [string, string][]>
) {
	if (
		dragging ||
		('pointerType' in originalEvent &&
			['touch', 'pen'].includes(originalEvent.pointerType))
	) {
		return null
	}

	let hasFeatureAtPixel = false
	let unregister: (() => void) | null = null

	// stops on return `true`, thus only using the uppermost feature
	map.forEachFeatureAtPixel(
		pixel,
		(feature, layer) => {
			if (!(feature instanceof Feature)) {
				return false
			}
			hasFeatureAtPixel = true
			overlay.setPosition(map.getCoordinateFromPixel(pixel))
			if (unregister) {
				unregister()
			}
			let element
			;({ element, unregister } = getTooltip(
				tooltipGenerators[layer.get('id')]?.(feature) as [string, string][]
			))
			overlay.setElement(element)
			return true
		},
		{
			layerFilter: (layer) =>
				Object.keys(tooltipGenerators).includes(layer.get('id')),
		}
	)

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!hasFeatureAtPixel) {
		overlay.setPosition(undefined)
	}

	return unregister
}
