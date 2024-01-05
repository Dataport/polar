import { PolarModule } from '@polar/lib-custom-types'
import { easeOut } from 'ol/easing'
import Point from 'ol/geom/Point'
import { reverseGeocode } from '../utils/reverseGeocode'
import { ReverseGeocoderFeature } from '../types'

// OK for module creation
// eslint-disable-next-line max-lines-per-function
export const makeStoreModule = () => {
  let loaderCounter = 0

  /*
   * NOTE: state, mutations, and getters are added to match PolarModule.
   * This module is created to interact with other modules via vuex context.
   * */
  const storeModule: PolarModule<
    Record<string, never>,
    Record<string, never>
  > = {
    namespaced: true,
    state: {},
    actions: {
      setupModule({ rootGetters, dispatch }): void {
        const { coordinateSource } =
          rootGetters.configuration.reverseGeocoder || {}

        if (coordinateSource) {
          this.watch<[number, number]>(
            () => rootGetters[coordinateSource],
            (coordinate) => {
              if (coordinate && coordinate.length) {
                dispatch('resolveCoordinate', coordinate)
              }
            },
            { deep: true }
          )
        }
      },
      async resolveCoordinate(
        { rootGetters, commit, dispatch },
        coordinate: [number, number]
      ): Promise<ReverseGeocoderFeature | null> {
        const { url, addressTarget, addLoading, removeLoading, zoomTo } =
          rootGetters.configuration.reverseGeocoder || {}
        const { map } = rootGetters

        if (!url) {
          throw new Error(
            'POLAR ReverseGeocoder#resolveCoordinate: No URL specified.'
          )
        }

        const localLoaderCounter = ++loaderCounter
        const loaderKey = `reverse-geocoder-load-${localLoaderCounter}`

        if (addLoading) {
          commit(addLoading, loaderKey, { root: true })
        }

        let feature: ReverseGeocoderFeature | null = null

        try {
          feature = await reverseGeocode(url, coordinate)
          if (localLoaderCounter === loaderCounter) {
            if (addressTarget) {
              dispatch(addressTarget, { feature }, { root: true })
            }
            if (typeof zoomTo === 'number') {
              map.getView().fit(new Point(coordinate), {
                maxZoom: zoomTo,
                duration: 400,
                easing: easeOut,
              })
            }
          }
        } catch (e) {
          console.error(
            'An error occurred in POLAR ReverseGeocoder#resolveCoordinate:'
          )
          console.error(e)
        } finally {
          if (removeLoading) {
            commit(removeLoading, loaderKey, { root: true })
          }
        }

        return feature
      },
    },
    getters: {},
    mutations: {},
  }
  return storeModule
}
