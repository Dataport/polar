import type { Collection } from 'ol'
import type BaseLayer from 'ol/layer/Base'

/**
 * Looks for all Layers that are currently visible.
 *
 * @param layers - contains all Layers
 * @returns an array of LayerIDs.
 *
 * @remarks
 * Only layers added through the services include the id property.
 */
export function getVisibleLayers(layers: Collection<BaseLayer>) {
	return layers
		.getArray()
		.filter((layer) => layer.getVisible() && layer.get('id'))
		.map((layer) => layer.get('id'))
}

if (import.meta.vitest) {
	const { expect, test } = import.meta.vitest
	const { Collection } = await import('ol')

	const createLayer = (visible: boolean, id?: string) =>
		({
			getVisible: () => visible,
			get: (key: string) => (key === 'id' ? id : undefined),
		}) as unknown as BaseLayer

	test('returns ids of visible layers that define an id', () => {
		const layers = new Collection<BaseLayer>([
			createLayer(true, 'visible-with-id'),
			createLayer(true),
			createLayer(false, 'hidden-with-id'),
		])

		expect(getVisibleLayers(layers)).toEqual(['visible-with-id'])
	})
}
