import type { Attribution } from '../types'

/**
 * Checks every layer (passed in layers) for visibility and returns an {@link Attribution}[]
 * for every visible Layer.
 *
 * @param layers - is an array of LayerIDs (number[]) for visible Layers.
 * @param attributions - is an array of all Attributions for this Map.
 * @returns an array for all attributions whose id matches the id of a visible layer.
 */
export function getVisibleAttributions(
	layers: string[],
	attributions: Attribution[]
) {
	const visibleAttributions: Attribution[] = []
	attributions.forEach((attribution) => {
		if (layers.includes(attribution.id)) {
			visibleAttributions.push(attribution)
		}
	})
	return visibleAttributions
}

if (import.meta.vitest) {
	const { expect, test } = import.meta.vitest

	const attribution = (id: string): Attribution => ({
		id,
		title: `title-${id}`,
	})

	test('returns only attributions whose id matches a visible layer', () => {
		const attributions = [attribution('a'), attribution('b'), attribution('c')]

		expect(getVisibleAttributions(['a', 'c'], attributions)).toEqual([
			attribution('a'),
			attribution('c'),
		])
	})
}
