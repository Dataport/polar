import { CoreGetters, CoreState, PolarStore } from '@polar/lib-custom-types'
import { WfsParameters, getWfsFeatures } from '@polar/lib-get-features'

export function formatSearchString(
  this: PolarStore<CoreState, CoreGetters>,
  signal: AbortSignal,
  url: string,
  inputValue: string,
  queryParameters: WfsParameters
) {
  const searchString =
    inputValue[0].toUpperCase() + inputValue.slice(1).toLowerCase()
  return getWfsFeatures(signal, url, `${searchString}*`, queryParameters)
}
