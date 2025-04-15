import { MapInstance } from '@polar/core'
import { getMapConfiguration } from '../mapConfigurations/mapConfig'
import { denkmaelerWfServiceExtern } from '../services'
import { DishParameters } from '../types'
import { zoomToFeatureById } from './zoomToFeatureById'

export function navigateToDenkmal(instance: MapInstance, objektId: string) {
  const mapConfiguration = getMapConfiguration('EXTERN')
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
  const { wfsConfiguration } = wfsConfig.queryParameters as DishParameters
  zoomToFeatureById(instance, objektId, denkmaelerWfServiceExtern.url, {
    ...wfsConfiguration,
    useRightHandWildcard: false,
  })
}
