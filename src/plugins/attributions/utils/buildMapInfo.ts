import type { Attribution } from '../types'

/**
 * Builds a string which contains the attributions for every visible Layer.
 *
 * @param infos - are all visible Layers.
 * @param staticAttributions - list of attributions to always display.
 * @returns an array of localizing string which contain all (copyright-)information of this Map.
 */
export function buildMapInfo(
	infos: Attribution[],
	staticAttributions: string[] = []
) {
	const text: string[] = []
	infos.forEach((attribution) => {
		text.push(attribution.title)
	})
	staticAttributions.forEach((attribution) => text.push(attribution))
	text.push('sourceCode')
	return text
}

if (import.meta.vitest) {
	const { expect, test } = import.meta.vitest

	const attribution = (id: string, title: string): Attribution => ({
		id,
		title,
	})

	test('lists layer titles followed by the source code entry', () => {
		const infos = [attribution('a', 'Thea'), attribution('b', 'Beta')]

		expect(buildMapInfo(infos)).toEqual(['Thea', 'Beta', 'sourceCode'])
	})

	test('appends static attributions between layer titles and the source code entry', () => {
		const infos = [attribution('a', 'Thea')]
		const staticAttributions = ['Static 1', 'Static 2']

		expect(buildMapInfo(infos, staticAttributions)).toEqual([
			'Thea',
			'Static 1',
			'Static 2',
			'sourceCode',
		])
	})
}
