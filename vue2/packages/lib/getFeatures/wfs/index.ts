import { KeyValueSetArray, WfsParameters } from '../types'
import { errorCheck } from '../utils/errorCheck'
import { parseWfsResponse } from './parse'
import { buildWfsFilter } from './buildWfsFilter'
import { match } from './match'

export async function getWfsFeatures(
  signal: AbortSignal | null,
  url: string,
  inputValue: string,
  parameters: WfsParameters
) {
  const { fieldName, patterns, patternKeys } = parameters
  if (!fieldName && (!patterns || !patternKeys)) {
    throw new Error(
      'Incomplete WFS search configuration. Either "fieldName" or "patterns" and "patternKeys" are required.'
    )
  }
  if (fieldName && patterns) {
    console.error(
      '@polar/lib-get-features: Using both fieldName and patterns for WFS search. These are mutually exclusive. Patterns will be ignored.'
    )
  }
  // arrays of sets of key-value-pairs
  const inputs: KeyValueSetArray = fieldName
    ? [[[fieldName, inputValue]]]
    : match(patterns, patternKeys, inputValue)

  const body = buildWfsFilter(inputs, parameters)

  const response = await fetch(encodeURI(url), { signal, method: 'POST', body })
  errorCheck(response)
  return parseWfsResponse(response, fieldName || patterns, !fieldName)
}
