import { WfsParameters } from '../types'
import { errorCheck } from '../utils/errorCheck'
import { parseWfsResponse } from './parse'
import { buildWfsFilter } from './buildWfsFilter'
import { match } from './match'

export function getWfsFeatures(
  signal: AbortSignal | null,
  url: string,
  inputValue: string,
  parameters: WfsParameters
) {
  const { fieldName, patterns, patternKeys } = parameters
  // arrays OF sets OF key-value-pairs
  let inputs: string[][][] = [[[]]]

  if (fieldName && patterns) {
    console.error(
      'Using both fieldName and patterns for WFS search. These are mutually exclusive. Patterns will be ignored.'
    )
  }

  if (fieldName) {
    inputs = [[[fieldName, inputValue]]]
  } else if (patterns && patternKeys) {
    inputs = match(patterns, patternKeys, inputValue)
  } else {
    console.error(
      'Incomplete WFS search configuration. Either "fieldName" or "patterns" and "patternKeys" are required.'
    )
  }

  const body = buildWfsFilter(inputs, parameters)

  return fetch(encodeURI(url), { signal, method: 'POST', body }).then(
    (response: Response) => {
      errorCheck(response)
      return parseWfsResponse(response, fieldName || patterns, !fieldName)
    }
  )
}
