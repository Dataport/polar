import { toMerged } from 'es-toolkit'

import type { KeyValueSetArray, WfsParameters } from '../types'

const removeLinebreaks = (s) => s.replace(/\r?\n|\r/g, '')

const getFeaturePrefix = ({ maxFeatures }: WfsParameters) =>
	`
<?xml version="1.0" encoding="UTF-8"?>
<wfs:GetFeature xmlns:wfs="http://www.opengis.net/wfs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"${
		maxFeatures ? ` maxFeatures="${maxFeatures}"` : ''
	}>`

const defaultLikeFilterAttributes = {
	wildCard: '*',
	singleChar: '.',
	escapeChar: '!',
}

const queryPrefix = ({
	srsName,
	featurePrefix,
	typeName,
	xmlns,
}: WfsParameters) => `
<wfs:Query typeName="${featurePrefix}:${typeName}" xmlns:${featurePrefix}="${xmlns}"${
	srsName ? ` srsName="${srsName}"` : ''
}>
<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">`

function wfsLike(
	fieldName: string,
	input: string,
	{ featurePrefix, useRightHandWildcard, likeFilterAttributes }: WfsParameters
) {
	const mergedLikeFilterAttributes = toMerged(
		defaultLikeFilterAttributes,
		likeFilterAttributes || {}
	)
	return `
<ogc:PropertyIsLike${Object.entries(mergedLikeFilterAttributes).reduce(
		(acc, [key, value]) => `${acc} ${key}="${value}"`,
		''
	)}>
<ogc:PropertyName>${featurePrefix}:${fieldName}</ogc:PropertyName>
<ogc:Literal>${input}${
		typeof useRightHandWildcard === 'boolean' && !useRightHandWildcard
			? ''
			: Object.hasOwn(mergedLikeFilterAttributes, 'wildCard')
				? mergedLikeFilterAttributes.wildCard
				: '*'
	}</ogc:Literal>
</ogc:PropertyIsLike>`
}

function buildWfsFilterQuery(
	patternMatch: string[][],
	parameters: WfsParameters
) {
	let request = queryPrefix(parameters)

	if (patternMatch.length > 1) {
		request += `<ogc:And>${patternMatch
			.map(([key, value]) =>
				wfsLike(key as string, value as string, parameters)
			)
			.join('')}</ogc:And>`
	} else if (patternMatch.length === 1) {
		const pattern = patternMatch[0] as string[]
		request += wfsLike(pattern[0] as string, pattern[1] as string, parameters)
	}

	return request + '</ogc:Filter></wfs:Query>'
}

/**
 * Builds filter of multiple queries from possible interpretations of inputs.
 * Multiple queries are sent so that service may stop computing after
 * maxFeatures has been fulfilled.
 * @returns request xml
 */
export const buildWfsFilter = (
	inputs: KeyValueSetArray,
	parameters: WfsParameters
) =>
	removeLinebreaks(
		getFeaturePrefix(parameters) +
			inputs.map((input) => buildWfsFilterQuery(input, parameters)).join('') +
			'</wfs:GetFeature>'
	)

if (import.meta.vitest) {
	const { expect, test } = import.meta.vitest

	const parameters: WfsParameters = {
		typeName: 'TyPeNaMe',
		epsg: 'EPSG:25832',
		featurePrefix: 'prefix',
		xmlns: 'example.com',
		maxFeatures: 999,
		patterns: [
			'{{gemarkung}} {{flur}} {{flstnrzae}}/{{flstnrnen}}, {{flstkennz}}',
			'{{gemarkung}} {{flur}} {{flstnrzae}}, {{flstkennz}}',
			'{{gemarkung}} {{flstnrzae}}/{{flstnrnen}}, {{flstkennz}}',
			'{{gemarkung}} {{flstnrzae}}, {{flstkennz}}',
			'{{flstkennz}}',
		],
		patternKeys: {
			gemarkung: '([^0-9]+)',
			flur: '([0-9]+)',
			flstnrzae: '([0-9]+)',
			flstnrnen: '([0-9]+)',
			flstkennz: '([0-9_]+)',
		},
	}

	test('creates an empty search for an empty input', () => {
		expect(buildWfsFilter([], parameters)).toEqual(
			'<?xml version="1.0" encoding="UTF-8"?><wfs:GetFeature xmlns:wfs="http://www.opengis.net/wfs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" maxFeatures="999"></wfs:GetFeature>'
		)
	})
	test('creates a one-query search for a single match', () => {
		expect(buildWfsFilter([[['a', '5']]], parameters)).toEqual(
			'<?xml version="1.0" encoding="UTF-8"?><wfs:GetFeature xmlns:wfs="http://www.opengis.net/wfs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" maxFeatures="999"><wfs:Query typeName="prefix:TyPeNaMe" xmlns:prefix="example.com"><ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"><ogc:PropertyIsLike wildCard="*" singleChar="." escapeChar="!"><ogc:PropertyName>prefix:a</ogc:PropertyName><ogc:Literal>5*</ogc:Literal></ogc:PropertyIsLike></ogc:Filter></wfs:Query></wfs:GetFeature>'
		)
	})
	test('creates a one-query and-ed search for a single match with multiple fields', () => {
		expect(
			buildWfsFilter(
				[
					[
						['a', '5'],
						['b', '3'],
					],
				],
				parameters
			)
		).toEqual(
			'<?xml version="1.0" encoding="UTF-8"?><wfs:GetFeature xmlns:wfs="http://www.opengis.net/wfs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" maxFeatures="999"><wfs:Query typeName="prefix:TyPeNaMe" xmlns:prefix="example.com"><ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"><ogc:And><ogc:PropertyIsLike wildCard="*" singleChar="." escapeChar="!"><ogc:PropertyName>prefix:a</ogc:PropertyName><ogc:Literal>5*</ogc:Literal></ogc:PropertyIsLike><ogc:PropertyIsLike wildCard="*" singleChar="." escapeChar="!"><ogc:PropertyName>prefix:b</ogc:PropertyName><ogc:Literal>3*</ogc:Literal></ogc:PropertyIsLike></ogc:And></ogc:Filter></wfs:Query></wfs:GetFeature>'
		)
	})
	test('creates a multi-query search for a multiple matches', () => {
		expect(buildWfsFilter([[['a', '5']], [['b', '3']]], parameters)).toEqual(
			'<?xml version="1.0" encoding="UTF-8"?><wfs:GetFeature xmlns:wfs="http://www.opengis.net/wfs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" maxFeatures="999"><wfs:Query typeName="prefix:TyPeNaMe" xmlns:prefix="example.com"><ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"><ogc:PropertyIsLike wildCard="*" singleChar="." escapeChar="!"><ogc:PropertyName>prefix:a</ogc:PropertyName><ogc:Literal>5*</ogc:Literal></ogc:PropertyIsLike></ogc:Filter></wfs:Query><wfs:Query typeName="prefix:TyPeNaMe" xmlns:prefix="example.com"><ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"><ogc:PropertyIsLike wildCard="*" singleChar="." escapeChar="!"><ogc:PropertyName>prefix:b</ogc:PropertyName><ogc:Literal>3*</ogc:Literal></ogc:PropertyIsLike></ogc:Filter></wfs:Query></wfs:GetFeature>'
		)
	})
}
