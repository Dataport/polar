import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import {
  LayerConfigurationOptionLayers,
  PolarModule,
} from '@polar/lib-custom-types'
import { rawLayerList } from '@masterportal/masterportalapi'
import { ImageWMS, TileWMS } from 'ol/source'
import Layer from 'ol/layer/Layer'
import { LayerChooserGetters, LayerChooserState } from '../types'
import { asIdList, areLayersActive } from '../utils/layerFolding'
import { getBackgroundsAndMasks } from '../utils/getBackgroundsAndMasks'
import { getOpenedOptionsServiceLayers } from '../utils/getOpenedOptionsServiceLayers'
import { isLayerIdIncluded } from '../utils/isLayerIdIncluded'

export const getInitialState = (): LayerChooserState => ({
  openedOptions: null,
  backgrounds: [],
  masks: [],
  availableBackgrounds: [],
  availableMasks: [],
  activeBackgroundId: '',
  activeMaskIds: [],
  activeLayerIds: {},
})

export const makeStoreModule = () => {
  const storeModule: PolarModule<LayerChooserState, LayerChooserGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions: {
      setupModule({
        state,
        rootGetters: { configuration, map },
        commit,
        dispatch,
      }): void {
        const [backgrounds, masks] = getBackgroundsAndMasks(configuration)

        // at most one background, arbitrarily many masks
        const activeBackground = backgrounds.find(
          ({ visibility }) => visibility
        )
        const activeMasks = masks.filter(({ visibility }) => visibility)

        commit('setBackgrounds', backgrounds)
        commit('setMasks', masks)
        dispatch('setActiveBackgroundId', activeBackground?.id || null)
        dispatch('setActiveMaskIds', asIdList(activeMasks))

        dispatch('updateActiveAndAvailableLayersByZoom')
        map.on('moveend', () =>
          dispatch('updateActiveAndAvailableLayersByZoom')
        )

        configuration.layers.forEach((layer) => {
          const rawLayer = rawLayerList.getLayerWhere({
            id: layer.id,
          })

          // Store preparation needed when `layers` is an option
          if (layer.options?.layers) {
            commit('setActiveLayerIds', {
              ...state.activeLayerIds,
              [layer.id]: rawLayer.layers.split(','),
            })
          }
          // GetCapabilities exactly needed when `true` set for an inferrable option
          if (
            typeof layer.options?.layers === 'object' &&
            (layer.options.layers?.title === true ||
              layer.options.layers?.legend === true)
          ) {
            dispatch('capabilities/loadCapabilities', layer.id, { root: true })
          }
        })
      },
      setActiveBackgroundId(
        { rootGetters: { map }, getters: { backgrounds }, commit },
        id
      ) {
        map
          .getLayers()
          .getArray()
          .forEach((layer) => {
            // only influence visibility if layer is managed as background
            if (backgrounds.find(({ id }) => id === layer.get('id'))) {
              layer.setVisible(layer.get('id') === id)
            }
          })
        commit('setActiveBackgroundId', id)
      },
      setActiveMaskIdsVisibility(
        { rootGetters: { map }, getters: { masks } },
        ids
      ) {
        map
          .getLayers()
          .getArray()
          .forEach((layer) => {
            // only influence visibility if layer is managed as background
            if (masks.find(({ id }) => id === layer.get('id'))) {
              layer.setVisible(ids.includes(layer.get('id')))
            }
          })
      },
      setActiveMaskIds({ commit, dispatch }, ids) {
        dispatch('setActiveMaskIdsVisibility', ids)
        commit('setActiveMaskIds', ids)
      },
      // when the zoom changes, it does what needs to be done
      updateActiveAndAvailableLayersByZoom({
        rootGetters: { map },
        getters: { backgrounds, masks, activeBackgroundId, activeMaskIds },
        commit,
        dispatch,
      }) {
        // NOTE: It is assumed that getZoom actually returns the currentZoomLevel, thus the view has a constraint in the resolution.
        const currentZoomLevel = map.getView().getZoom() as number

        const availableBackgrounds = areLayersActive(
          backgrounds,
          currentZoomLevel
        )
        const availableMasks = areLayersActive(masks, currentZoomLevel)

        const availableBackgroundIds = asIdList(availableBackgrounds)
        const availableMaskIds = asIdList(availableMasks)

        // if the background map is no longer available, switch to first-best or none
        if (!availableBackgroundIds.includes(activeBackgroundId)) {
          dispatch('setActiveBackgroundId', availableBackgroundIds[0] || '')
        }

        // update mask layer visibility, but don't toggle on/off – we still keep active layers active even when currently not available, so after zooming back they snap right back in
        dispatch(
          'setActiveMaskIdsVisibility',
          availableMaskIds.filter((id) => activeMaskIds.includes(id as string))
        )

        // commits as a final step to not override source information during work
        commit('setAvailableBackgrounds', availableBackgrounds)
        commit('setAvailableMasks', availableMasks)
      },
      toggleOpenedOptionsServiceLayer(
        {
          commit,
          rootGetters,
          getters: {
            openedOptionsService,
            openedOptionsServiceLayers,
            activeLayerIds,
          },
        },
        value
      ) {
        // keep configured layer order - vuetify puts last activated last
        const sortedValue =
          openedOptionsServiceLayers === null
            ? value
            : openedOptionsServiceLayers
                .filter(({ layerName }) => value.includes(layerName))
                .map(({ layerName }) => layerName)
                .reverse()
        const olLayer = rootGetters.map
          .getLayers()
          .getArray()
          .find((l) => l.get('id') === openedOptionsService.id) as Layer<
          ImageWMS | TileWMS
        >
        const olSource = olLayer?.getSource?.()

        if (!olLayer || !olSource) {
          console.error(
            `@polar/plugin-layer-chooser: Action 'toggleOpenedOptionsServiceLayer' failed on ${openedOptionsService.id} with value ${sortedValue}. Layer not found in OL, or source not initialized in OL.`
          )
          return
        }

        const updatedParams = { ...olSource.getParams(), LAYERS: sortedValue }

        olSource.updateParams(updatedParams)
        commit('setActiveLayerIds', {
          ...activeLayerIds,
          [openedOptionsService.id]: sortedValue,
        })
      },
    },
    mutations: {
      ...generateSimpleMutations(getInitialState()),
    },
    getters: {
      ...generateSimpleGetters(getInitialState()),
      component: (_, __, ___, rootGetters) =>
        rootGetters.configuration.layerChooser?.component
          ? rootGetters.configuration.layerChooser.component
          : null,
      disabledBackgrounds(_, { availableBackgrounds, backgrounds }) {
        return backgrounds.reduce(
          (acc, { id }) => ({
            ...acc,
            [id]: isLayerIdIncluded(availableBackgrounds, id) === -1,
          }),
          {}
        )
      },
      disabledMasks(_, { availableMasks, masks }) {
        return masks
          .filter(({ hideInMenu }) => !hideInMenu)
          .reduce(
            (acc, { id }) => ({
              ...acc,
              [id]: isLayerIdIncluded(availableMasks, id) === -1,
            }),
            {}
          )
      },
      idsWithOptions(_, { backgrounds, masks }) {
        return [...backgrounds, ...masks]
          .filter((layer) => Boolean(layer.options))
          .map((layer) => layer.id)
      },
      masksSeparatedByType: (_, { shownMasks }) =>
        shownMasks.reduce((acc, mask) => {
          if (Object.keys(acc).includes(mask.type)) {
            return { ...acc, [mask.type]: [...acc[mask.type], mask] }
          }
          return { ...acc, [mask.type]: [mask] }
        }, {}),
      openedOptionsService(_, { backgrounds, masks, openedOptions }) {
        return [...backgrounds, ...masks].find(
          (service) => service.id === openedOptions
        )
      },
      openedOptionsServiceLayers(_, { openedOptionsService }, __, rootGetters) {
        const layers: LayerConfigurationOptionLayers | undefined =
          openedOptionsService?.options?.layers

        if (typeof layers === 'undefined') {
          return null
        }

        const serviceDefinition = rawLayerList.getLayerWhere({
          id: openedOptionsService.id,
        })

        if (!serviceDefinition.layers) {
          console.error(
            '@polar/plugin-layer-chooser: Trying to configure layers of a layer without "layers" field.',
            serviceDefinition
          )
          return null
        }

        const wmsCapabilitiesJson = rootGetters?.[
          'capabilities/wmsCapabilitiesAsJsonById'
        ](openedOptionsService.id)

        if (wmsCapabilitiesJson === null) {
          console.error(
            `@polar/plugin-layer-chooser: CapabilitiesJson for layer ${JSON.stringify(
              openedOptionsService
            )} is null.`
          )
          return null
        }

        return getOpenedOptionsServiceLayers(
          layers.order?.split?.(',') || serviceDefinition.layers.split(','),
          layers,
          wmsCapabilitiesJson
        )
      },
      shownMasks({ masks }) {
        return masks.filter(({ hideInMenu }) => !hideInMenu)
      },
    },
  }

  return storeModule
}
