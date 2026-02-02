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
