import merge from 'lodash.merge'
import { KeyValueSetArray, WfsParameters, WFSVersion } from '../types'

const removeLinebreaks = (s) => s.replace(/\r?\n|\r/g, '')

interface VersionParameters {
  wfsNamespace: string
  filterPrefix: string
  filterNamespace: string
  schemaLocation: string
  typeNameAttribute: string
  maxFeaturesAttribute: string
  propertyNameElement: string
}

const wfs110Parameters: VersionParameters = {
  wfsNamespace: 'http://www.opengis.net/wfs',
  filterPrefix: 'ogc',
  filterNamespace: 'http://www.opengis.net/ogc',
  schemaLocation:
    'http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd',
  typeNameAttribute: 'typeName',
  maxFeaturesAttribute: 'maxFeatures',
  propertyNameElement: 'PropertyName',
}

const wfs200Parameters: VersionParameters = {
  wfsNamespace: 'http://www.opengis.net/wfs/2.0',
  filterPrefix: 'fes',
  filterNamespace: 'http://www.opengis.net/fes/2.0',
  schemaLocation:
    'http://www.opengis.net/wfs/2.0 http://schemas.opengis.net/wfs/2.0/wfs.xsd',
  typeNameAttribute: 'typeNames',
  maxFeaturesAttribute: 'count',
  propertyNameElement: 'ValueReference',
}

const getVersionParameters = (version?: WFSVersion): VersionParameters =>
  version === '2.0.0' ? wfs200Parameters : wfs110Parameters

const getFeaturePrefix = ({ maxFeatures, version }: WfsParameters) => {
  const versionConfig = getVersionParameters(version)
  return `
<?xml version="1.0" encoding="UTF-8"?>
<wfs:GetFeature xmlns:wfs="${
    versionConfig.wfsNamespace
  }" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" service="WFS" version="${
    version ?? '1.1.0'
  }" xsi:schemaLocation="${versionConfig.schemaLocation}"${
    maxFeatures ? ` ${versionConfig.maxFeaturesAttribute}="${maxFeatures}"` : ''
  }>`
}

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
  version,
}: WfsParameters) => {
  const { typeNameAttribute, filterPrefix, filterNamespace } =
    getVersionParameters(version)
  return `
<wfs:Query ${typeNameAttribute}="${featurePrefix}:${typeName}" xmlns:${featurePrefix}="${xmlns}" xmlns:${filterPrefix}="${filterNamespace}"${
    srsName ? ` srsName="${srsName}"` : ''
  }>
<${filterPrefix}:Filter>`
}

const wfsLike = (
  fieldName: string,
  input: string,
  {
    featurePrefix,
    useRightHandWildcard,
    likeFilterAttributes,
    caseSensitive,
    version,
  }: WfsParameters
) => {
  const { filterPrefix, propertyNameElement } = getVersionParameters(version)
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
  version?: WFSVersion
) => {
  const { filterPrefix, propertyNameElement } = getVersionParameters(version)
  return `<${filterPrefix}:SortBy>
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
}

const querySuffix = (
  sortBy?: { propertyName: string; direction?: 'ASC' | 'DESC' }[],
  featurePrefix?: string,
  version?: WFSVersion
) => {
  const { filterPrefix } = getVersionParameters(version)
  return `</${filterPrefix}:Filter>${
    sortBy?.length && featurePrefix
      ? querySortBy(sortBy, featurePrefix, version)
      : ''
  }
</wfs:Query>`
}

const getFeatureSuffix = `</wfs:GetFeature>`

const buildWfsFilterQuery = (
  patternMatch: string[][],
  parameters: WfsParameters
) => {
  const { filterPrefix } = getVersionParameters(parameters.version)
  let request = queryPrefix(parameters)

  if (patternMatch.length > 1) {
    request += `<${filterPrefix}:And>${patternMatch
      .map(([key, value]) => wfsLike(key, value, parameters))
      .join('')}</${filterPrefix}:And>`
  } else if (patternMatch.length === 1) {
    const [key, value] = patternMatch[0]
    request += wfsLike(key, value, parameters)
  }

  return (
    request +
    querySuffix(parameters.sortBy, parameters.featurePrefix, parameters.version)
  )
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
