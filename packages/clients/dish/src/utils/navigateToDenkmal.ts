import { denkmaelerWfServiceExtern } from '../services'
import { getMapConfiguration } from '../mapConfigurations/mapConfig'
import { zoomToFeatureById } from './zoomToFeatureById'

const mapConfiguration = getMapConfiguration('EXTERN')

export function navigateToDenkmal(instance, objektId: string) {
  const wfsConfig = mapConfiguration.addressSearch.searchMethods.find(
    ({ type }) => type === 'dish'
  )

  if (!wfsConfig) {
    throw new Error('Client is missing wfsConfig on DISH search method.')
  }
  if (!wfsConfig.queryParameters) {
    throw new Error(
      'Client is missing wfsConfig.queryParameters on DISH search method.'
    )
  }
  zoomToFeatureById(instance, objektId, denkmaelerWfServiceExtern.url, {
    ...wfsConfig.queryParameters.wfsConfiguration,
    useRightHandWildcard: false,
  })
}
