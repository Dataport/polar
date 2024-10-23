import { denkmaelerWfsServiceExtern } from '../services'
import { getMapConfiguration } from '../mapConfig'
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
  zoomToFeatureById(instance, objektId, denkmaelerWfsServiceExtern.url, {
    ...wfsConfig.queryParameters.wfsConfiguration,
    useRightHandWildcard: false,
  })
}
