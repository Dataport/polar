import { generateSimpleGetters } from '@repositoryname/vuex-generators'
import { rawLayerList } from '@masterportal/masterportalapi/src'
import { Module } from 'vuex'
import WMSCapabilities from 'ol/format/WMSCapabilities'

const parser = new WMSCapabilities()

export interface CoreCapabilitiesState {
  /**
   * maps a layer id to its GetCapabilities xml return value;
   * null if an error happened
   */
  capabilities: Record<string, string | null>
}

const getInitialState = (): CoreCapabilitiesState => ({
  capabilities: {},
})

export const CapabilitiesModule: Module<CoreCapabilitiesState, object> = {
  namespaced: true,
  state: getInitialState(),
  actions: {
    loadCapabilities({ commit, getters }, id: string) {
      const previous = getters.capabilities[id]
      if (typeof previous !== 'undefined' && previous !== null) {
        console.warn(
          `Re-fired loadCapabilities on id '${id}' albeit the GetCapabilities have already been successfully fetched. No re-fetch will occur.`
        )
        return
      }

      // block access to prevent duplicate requests
      commit('addCapabilities', { id, string: null })

      const service = rawLayerList.getLayerWhere({ id })
      if (!service || !service.url || !service.version || !service.typ) {
        console.error(`Missing data for service with id '${id}': ${service}`)
        return
      }

      const capabilitiesUrl = `${service.url}?service=${service.typ}&version=${service.version}&request=GetCapabilities`

      fetch(capabilitiesUrl)
        .then((response) => response.text())
        .then((string) => commit('addCapabilities', { id, string }))
        .catch((e) => {
          console.error(
            e,
            `Capabilities from ${capabilitiesUrl} could not be fetched.`
          )
          commit('addCapabilities', { id, string: null })
        })
    },
  },
  mutations: {
    addCapabilities(state, { id, string }) {
      state.capabilities[id] = string
    },
  },
  getters: {
    ...generateSimpleGetters(getInitialState()),
    wmsCapabilitiesAsJsonById:
      (state: CoreCapabilitiesState) =>
      (id: string): object | null => {
        const xml = state.capabilities[id]
        if (xml) {
          try {
            const json = parser.read(xml)
            return json
          } catch (e) {
            console.error(e, `Error reading xml for id '${id}': ${xml}`)
          }
        }
        return null
      },
  },
}
