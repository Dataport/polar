import Vue from 'vue'
import { makeStore } from '../../vuePlugins/vuex'
import language from '../../language'
import { MapContainer } from '../../components'
import { CreateOptions, MapInstance } from '../../types'
import subscribeFunction from './subscribe'
import { updateSizeOnReady } from './updateSizeOnReady'
import { makeShadowRoot } from './makeShadowRoot'
import { pullPolarStyleToShadow } from './pullPolarStyleToShadow'
import { setupFontawesome } from './setupFontawesome'

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

  await language(mapConfiguration?.language)

  const instance: MapInstance = new Vue({
    el: shadowRoot.appendChild(document.createElement('div')),
    render: (createElement) =>
      createElement(MapContainer, {
        props: {
          mapConfiguration,
        },
      }),
    store: makeStore(),
  })
  instance.subscribe = subscribeFunction

  pullPolarStyleToShadow(shadowRoot, mapConfiguration.stylePath)
  setupFontawesome(shadowRoot, mapConfiguration.renderFaToLightDom)
  updateSizeOnReady(instance)

  return instance
}
