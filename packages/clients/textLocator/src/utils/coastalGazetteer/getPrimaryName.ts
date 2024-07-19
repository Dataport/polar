import { ResponseName } from './types'

/**
 * Finds primary names of a response and returns them comma-separated as string.
 * If no primary name is included, the first-best name will be chosen.
 * If no name exists, '???' is returned as a fallback (as in Küstengazetteer).
 */
export const getPrimaryName = (names: ResponseName[]): string =>
  names
    .filter((name) => name.Typ === 'Primärer Name')
    .map((name) => `${name.Name}`)
    .join(', ') ||
  names[0]?.Name ||
  '???'
