import { getWfsFeatures as wfs } from '@polar/lib-get-features'
import { SearchMethodFunction } from '@polar/lib-custom-types'
import bkg from './bkg'
import gazetteer from './gazetteer'
import mpapi from './mpapi'

const methods = { bkg, gazetteer, wfs, mpapi }

export const registerSearchMethods = (
  additionalMethods: Record<string, SearchMethodFunction>
): void =>
  Object.entries(additionalMethods).forEach(([type, searchMethod]) => {
    if (methods[type]) {
      console.error(
        `AddressSearch: Method "${type}" already exists. Please choose a different name. Overrides are not allowed.`
      )
    } else {
      methods[type] = searchMethod
    }
  })

export default function (type: string): SearchMethodFunction {
  const method = methods[type]
  if (method) {
    return method
  }
  throw new Error(
    `AddressSearch: The given type "${type}" does not define a valid searchMethod.`
  )
}
