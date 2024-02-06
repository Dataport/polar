import { generateSimpleGetters } from '@repositoryname/vuex-generators'
import { PolarGetterTree, RenderType } from '@polar/lib-custom-types'
import { GeoLocationGetters, GeoLocationState } from '../types'
import getInitialState from './getInitialState'

const getters: PolarGetterTree<GeoLocationState, GeoLocationGetters> = {
  ...generateSimpleGetters(getInitialState()),
  boundaryLayerId: (_, __, ___, rootGetters): string | undefined => {
    return rootGetters.configuration?.geoLocation?.boundaryLayerId
  },
  boundaryOnError: (_, __, ___, rootGetters) => {
    return (
      rootGetters.configuration?.geoLocation?.boundaryOnError || 'permissive'
    )
  },
  configuredEpsg: (_, __, ___, rootGetters): string | undefined => {
    return rootGetters.configuration?.epsg
  },
  checkLocationInitially: (_, __, ___, rootGetters): boolean => {
    return (
      rootGetters.configuration?.geoLocation?.checkLocationInitially || false
    )
  },
  keepCentered: (_, __, ___, rootGetters): boolean => {
    const keepCentered = rootGetters.configuration?.geoLocation?.keepCentered
    if (typeof keepCentered === 'boolean') {
      return keepCentered
    }
    return false
  },
  renderType: (_, __, ___, rootGetters): RenderType => {
    return rootGetters.configuration?.geoLocation?.renderType || 'independent'
  },
  showTooltip: (_, __, ___, rootGetters): boolean => {
    return Boolean(rootGetters.configuration?.geoLocation?.showTooltip)
  },
  toastAction: (_, __, ___, rootGetters): string | undefined => {
    return rootGetters.configuration?.geoLocation?.toastAction
  },
  zoomLevel: (_, __, ___, rootGetters): number => {
    return rootGetters.configuration?.geoLocation?.zoomLevel || 7
  },
  geoLocationMarkerLayer(_, __, ___, rootGetters) {
    return rootGetters?.map
      .getLayers()
      .getArray()
      .find((layer) => layer.get('name') === 'geoLocationMarkerLayer')
  },
  markerFeature(_, { geoLocationMarkerLayer }) {
    return (
      geoLocationMarkerLayer
        ?.getSource?.()
        ?.getFeatures?.()
        ?.find?.((feature) => feature.get('name') === 'geoLocationMarker') ||
      null
    )
  },
}

export default getters
