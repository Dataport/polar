import Vue from 'vue'
import store from '../../vuePlugins/vuex'
import vuetify from '../../vuePlugins/vuetify'
import language from '../../language'
import { MapContainer } from '../../components'
import { CreateOptions, MapInstance } from '../../types'
import subscribeFunction from './subscribe'
import { updateSizeOnReady } from './updateSizeOnReady'
import { makeShadowRoot } from './makeShadowRoot'
import { pullPolarStyleToShadow } from './pullPolarStyleToShadow'
import { pullVuetifyStyleToShadow } from './pullVuetifyStyleToShadow'

/**
 * createMap handles plugging all the parts together to create a configured map.
 * This method is loosely based on
 * {@link https://github.com/vuetifyjs/vuetify/issues/7622#issuecomment-624500549}
 * to create a shadow-dom'd map client unaffected by css issues of the
 * run-time environment.
 */
export default async function createMap({
  containerId,
  mapConfiguration,
}: CreateOptions): Promise<MapInstance> {
  const shadowRoot = await makeShadowRoot(containerId)

  const instance: MapInstance = new Vue({
    vuetify: vuetify(mapConfiguration?.vuetify),
    i18n: language(mapConfiguration?.language),
    el: shadowRoot.appendChild(document.createElement('div')),
    render: (createElement) =>
      createElement(MapContainer, {
        props: {
          mapConfiguration,
        },
      }),
    store,
  })
  instance.subscribe = subscribeFunction

  pullPolarStyleToShadow(shadowRoot)
  pullVuetifyStyleToShadow(shadowRoot)
  updateSizeOnReady(instance)

  return instance
}
