// some names are defined by the environment
/* eslint-disable camelcase */

import { PolarModule } from '@polar/lib-custom-types'

interface SetMapStatePayload {
  mapCenter: string // resembling 'number,number'
  mapZoomLevel: number | string
  mapBaseLayer: number | string
  vendor_maps_position: string // resembling 'number,number'
  vendor_maps_address_str: string
  vendor_maps_address_hnr: number | string
}

const readAfmCoordinate = (coordinate: string): number[] =>
  coordinate.split(',').map((s) => Number(s))

/*
 * Meldemichel VueX Store Module
 * This serves as an interface for systems using this client.
 */
const meldemichelModule: PolarModule<
  Record<string, never>,
  Record<string, never>
> = {
  namespaced: true,
  state: {},
  actions: {
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
  getters: {},
}

export default meldemichelModule
