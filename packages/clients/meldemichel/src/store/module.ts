// some names are defined by the environment
/* eslint-disable camelcase */

import { PolarModule } from '@polar/lib-custom-types'

interface SetMapStatePayload {
  mapCenter?: string // resembling 'number,number'
  mapZoomLevel?: number | string
  mapBaseLayer?: number | string
  vendor_maps_position?: string // resembling 'number,number'
  vendor_maps_address_str?: string
  vendor_maps_address_hnr?: number | string
}

interface GetMapState extends SetMapStatePayload {
  vendor_maps_address_plz: string
  vendor_maps_distance_to: number // distance between address and marker
}

export interface MeldemichelGetters {
  mapState: GetMapState
}

const readAfmCoordinate = (coordinate: string): number[] =>
  coordinate.split(',').map((s) => Number(s))

/*
 * Meldemichel VueX Store Module
 * This serves as an interface for systems using this client.
 */
const meldemichelModule: PolarModule<
  Record<string, never>,
  MeldemichelGetters
> = {
  namespaced: true,
  state: {},
  actions: {
    // setupModule({ getters }): void {},
    setMapState: (
      { commit, dispatch, rootGetters: { map } },
      {
        mapCenter,
        mapZoomLevel,
        mapBaseLayer,
        vendor_maps_position,
        vendor_maps_address_str,
        vendor_maps_address_hnr,
      }: SetMapStatePayload
    ) => {
      if (mapCenter) {
        map.getView().setCenter(readAfmCoordinate(mapCenter))
      }
      if (mapZoomLevel) {
        dispatch('plugin/zoom/setZoomLevel', Number(mapZoomLevel), {
          root: true,
        })
      }
      if (mapBaseLayer) {
        dispatch(
          'plugin/layerChooser/setActiveBackgroundId',
          String(mapBaseLayer),
          {
            root: true,
          }
        )
      }
      if (vendor_maps_address_str && vendor_maps_address_hnr) {
        commit(
          'plugin/addressSearch/setInputValue',
          `${vendor_maps_address_str} ${vendor_maps_address_hnr}`,
          { root: true }
        )
      }
      if (vendor_maps_position) {
        dispatch(
          'plugin/pins/showMarker',
          {
            clicked: true,
            epsg: 'EPSG:25832',
            type: 'Point',
            coordinates: readAfmCoordinate(vendor_maps_position),
          },
          { root: true }
        )
      }
    },
  },
  mutations: {},
  getters: {
    mapState(_, __, rootState): GetMapState {
      let address = rootState?.plugin?.addressSearch?.chosenAddress
      if (address?.type !== 'reverse_geocoded') {
        // wait for reverse geocoder result
        address = null
      }
      return {
        mapCenter: rootState.center?.join(',') || '',
        mapZoomLevel: rootState?.plugin?.zoom?.zoomLevel,
        mapBaseLayer: rootState?.plugin?.layerChooser?.activeBackgroundId,
        vendor_maps_position:
          rootState?.plugin?.pins?.transformedCoordinate?.join?.(',') ||
          undefined,
        vendor_maps_address_str: address?.properties?.Strasse,
        vendor_maps_address_hnr: address
          ? `${address.properties.Hausnr}${address.properties.Zusatz}`
          : undefined,
        vendor_maps_address_plz: address?.properties?.Plz,
        vendor_maps_distance_to: address?.properties?.Distanz,
      }
    },
  },
}

export default meldemichelModule
