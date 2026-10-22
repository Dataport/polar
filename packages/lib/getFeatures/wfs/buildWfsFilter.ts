import merge from 'lodash.merge'
import { KeyValueSetArray, WfsParameters, WFSVersion } from '../types'

const removeLinebreaks = (s) => s.replace(/\r?\n|\r/g, '')

interface VersionParameters {
  version: WFSVersion
  wfsNamespace: string
  filterPrefix: string
  filterNamespace: string
  schemaLocation: string
  typeNameAttribute: string
  maxFeaturesAttribute: string
  propertyNameElement: string
}

const defaultVersion: WFSVersion = '1.1.0'

const versionParameters: Record<WFSVersion, VersionParameters> = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '1.1.0': {
    version: '1.1.0',
    wfsNamespace: 'http://www.opengis.net/wfs',
    filterPrefix: 'ogc',
    filterNamespace: 'http://www.opengis.net/ogc',
    schemaLocation:
      'http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd',
    typeNameAttribute: 'typeName',
    maxFeaturesAttribute: 'maxFeatures',
    propertyNameElement: 'PropertyName',
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '2.0.0': {
    version: '2.0.0',
    wfsNamespace: 'http://www.opengis.net/wfs/2.0',
    filterPrefix: 'fes',
    filterNamespace: 'http://www.opengis.net/fes/2.0',
    schemaLocation:
      'http://www.opengis.net/wfs/2.0 http://schemas.opengis.net/wfs/2.0/wfs.xsd',
    typeNameAttribute: 'typeNames',
    maxFeaturesAttribute: 'count',
    propertyNameElement: 'ValueReference',
  },
}

const getFeaturePrefix = (
  { maxFeatures }: WfsParameters,
  {
    version,
    wfsNamespace,
    schemaLocation,
    maxFeaturesAttribute,
  }: VersionParameters
) => `
<?xml version="1.0" encoding="UTF-8"?>
<wfs:GetFeature xmlns:wfs="${wfsNamespace}" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" service="WFS" version="${version}" xsi:schemaLocation="${schemaLocation}"${
  maxFeatures ? ` ${maxFeaturesAttribute}="${maxFeatures}"` : ''
}>`

const defaultLikeFilterAttributes = {
  wildCard: '*',
  singleChar: '.',
  escapeChar: '!',
}

const queryPrefix = (
  { srsName, featurePrefix, typeName, xmlns }: WfsParameters,
  { typeNameAttribute, filterPrefix, filterNamespace }: VersionParameters
) => `
<wfs:Query ${typeNameAttribute}="${featurePrefix}:${typeName}" xmlns:${featurePrefix}="${xmlns}" xmlns:${filterPrefix}="${filterNamespace}"${
  srsName ? ` srsName="${srsName}"` : ''
}>
<${filterPrefix}:Filter>`

const wfsLike = (
  fieldName: string,
  input: string,
  {
    featurePrefix,
    useRightHandWildcard,
    likeFilterAttributes,
    caseSensitive,
  }: WfsParameters,
  { filterPrefix, propertyNameElement }: VersionParameters
) => {
  const mergedLikeFilterAttributes = merge(
    {},
    defaultLikeFilterAttributes,
    likeFilterAttributes,
    caseSensitive !== undefined ? { matchCase: caseSensitive } : {}
  )
  return `
<${filterPrefix}:PropertyIsLike${Object.entries(
    mergedLikeFilterAttributes
  ).reduce((acc, [key, value]) => `${acc} ${key}="${value}"`, '')}>
<${filterPrefix}:${propertyNameElement}>${featurePrefix}:${fieldName}</${filterPrefix}:${propertyNameElement}>
<${filterPrefix}:Literal>${input}${
    typeof useRightHandWildcard === 'boolean' && !useRightHandWildcard
      ? ''
      : Object.hasOwn(mergedLikeFilterAttributes, 'wildCard')
      ? mergedLikeFilterAttributes.wildCard
      : '*'
  }</${filterPrefix}:Literal>
</${filterPrefix}:PropertyIsLike>`
}

const querySortBy = (
  sortBy: { propertyName: string; direction?: 'ASC' | 'DESC' }[],
  featurePrefix: string,
  { filterPrefix, propertyNameElement }: VersionParameters
) => `<${filterPrefix}:SortBy>
${sortBy
  .map(
    ({ propertyName, direction = 'ASC' }) =>
      `<${filterPrefix}:SortProperty>
<${filterPrefix}:${propertyNameElement}>${featurePrefix}:${propertyName}</${filterPrefix}:${propertyNameElement}>
<${filterPrefix}:SortOrder>${direction}</${filterPrefix}:SortOrder>
</${filterPrefix}:SortProperty>`
  )
  .join('')}
</${filterPrefix}:SortBy>`

const querySuffix = (
  { sortBy, featurePrefix }: WfsParameters,
  versionConfig: VersionParameters
) => `</${versionConfig.filterPrefix}:Filter>${
  sortBy?.length && featurePrefix
    ? querySortBy(sortBy, featurePrefix, versionConfig)
    : ''
}
</wfs:Query>`

const getFeatureSuffix = `</wfs:GetFeature>`

const buildWfsFilterQuery = (
  patternMatch: string[][],
  parameters: WfsParameters,
  versionConfig: VersionParameters
) => {
  const { filterPrefix } = versionConfig
  let request = queryPrefix(parameters, versionConfig)

  if (patternMatch.length > 1) {
    request += `<${filterPrefix}:And>${patternMatch
      .map(([key, value]) => wfsLike(key, value, parameters, versionConfig))
      .join('')}</${filterPrefix}:And>`
  } else if (patternMatch.length === 1) {
    const [key, value] = patternMatch[0]
    request += wfsLike(key, value, parameters, versionConfig)
  }

  return request + querySuffix(parameters, versionConfig)
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
) => {
  // unsupported versions from untyped configurations fall back to the default
  const versionConfig =
    versionParameters[parameters.version ?? defaultVersion] ??
    versionParameters[defaultVersion]

  return removeLinebreaks(
    getFeaturePrefix(parameters, versionConfig) +
      inputs
        .map((input) => buildWfsFilterQuery(input, parameters, versionConfig))
        .join('') +
      getFeatureSuffix
  )
}
