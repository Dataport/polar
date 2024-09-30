import merge from 'lodash.merge'
import { KeyValueSetArray, WfsParameters } from '../types'

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

const wfsLike = (
  fieldName: string,
  input: string,
  { featurePrefix, useRightHandWildcard, likeFilterAttributes }: WfsParameters
) => {
  const mergedLikeFilterAttributes = merge(
    {},
    defaultLikeFilterAttributes,
    likeFilterAttributes
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

const querySuffix = `</ogc:Filter></wfs:Query>`

const getFeatureSuffix = `</wfs:GetFeature>`

const buildWfsFilterQuery = (
  patternMatch: string[][],
  parameters: WfsParameters
) => {
  let request = queryPrefix(parameters)

  if (patternMatch.length > 1) {
    request += `<ogc:And>${patternMatch
      .map(([key, value]) => wfsLike(key, value, parameters))
      .join('')}</ogc:And>`
  } else if (patternMatch.length === 1) {
    const [key, value] = patternMatch[0]
    request += wfsLike(key, value, parameters)
  }

  return request + querySuffix
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
      getFeatureSuffix
  )
