import { getWfsFeatures as wfs } from '@polar/lib-get-features'
import { SearchMethodFunction } from '@polar/lib-custom-types'
import bkg from './bkg'
import gazetteer from './gazetteer'
import mpapi from './mpapi'

export const getMethodContainer = () => {
  const methods = { bkg, gazetteer, wfs, mpapi }

  const registerSearchMethods = (
    additionalMethods: Record<string, SearchMethodFunction>
  ): void =>
    Object.entries(additionalMethods).forEach(([type, searchMethod]) => {
      if (methods[type]) {
        console.error(
          `@polar/plugin-address-search: Method "${type}" already exists. Please choose a different name. Overrides are not allowed.`
        )
      } else {
        methods[type] = searchMethod
      }
    })

  function getSearchMethod(type: string): SearchMethodFunction {
    const method = methods[type]
    if (method) {
      return method
    }
    throw new Error(
      `The given type "${type}" does not define a valid searchMethod.`
    )
  }

  return {
    registerSearchMethods,
    getSearchMethod,
  }
}
