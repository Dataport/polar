import Vue from 'vue'
import { makeStore } from '../../vuePlugins/vuex'
import vuetify from '../../vuePlugins/vuetify'
import initializeI18n from '../../i18n'
import { MapContainer } from '../../components'
import { CreateOptions, MapInstance } from '../../types'
import defaults from './defaults'
import subscribeFunction from './subscribe'
import { updateSizeOnReady } from './updateSizeOnReady'
import { makeShadowRoot } from './makeShadowRoot'
import { pullPolarStyleToShadow } from './pullPolarStyleToShadow'
import { pullVuetifyStyleToShadow } from './pullVuetifyStyleToShadow'
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

  await initializeI18n(mapConfiguration?.language)

  // Do not break outside Vuetify app's theme
  const externalStylesheet = document.getElementById('vuetify-theme-stylesheet')
  if (externalStylesheet) {
    externalStylesheet.id = 'vuetify-theme-stylesheet-external'
  }

  const instance: MapInstance = new Vue({
    vuetify: vuetify(mapConfiguration?.vuetify),
    el: shadowRoot.appendChild(document.createElement('div')),
    render: (createElement) =>
      createElement(MapContainer, {
        props: {
          mapConfiguration: { ...defaults, ...mapConfiguration },
        },
      }),
    store: makeStore(),
  })
  instance.subscribe = subscribeFunction

  pullPolarStyleToShadow(shadowRoot, mapConfiguration.stylePath)
  pullVuetifyStyleToShadow(shadowRoot)
  setupFontawesome(shadowRoot, mapConfiguration.renderFaToLightDom)
  updateSizeOnReady(instance)

  // Restore theme ID such that external Vuetify app can find it again
  if (externalStylesheet) {
    externalStylesheet.id = 'vuetify-theme-stylesheet'
  }

  return instance
}
