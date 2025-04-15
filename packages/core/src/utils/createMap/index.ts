import Vue from 'vue'
import { MapContainer } from '../../components'
import initializeI18n from '../../i18n'
import { CreateOptions, MapInstance } from '../../types'
import vuetify from '../../vuePlugins/vuetify'
import { makeStore } from '../../vuePlugins/vuex'
import defaults from './defaults'
import { makeShadowRoot } from './makeShadowRoot'
import { pullPolarStyleToShadow } from './pullPolarStyleToShadow'
import { pullVuetifyStyleToShadow } from './pullVuetifyStyleToShadow'
import { setupFontawesome } from './setupFontawesome'
import subscribeFunction from './subscribe'
import { updateSizeOnReady } from './updateSizeOnReady'

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

  const defaultedConfiguration = { ...defaults, ...mapConfiguration }

  const instance: MapInstance = new Vue({
    vuetify: vuetify(defaultedConfiguration?.vuetify),
    el: shadowRoot.appendChild(document.createElement('div')),
    render: (createElement) =>
      createElement(MapContainer, {
        props: {
          mapConfiguration: defaultedConfiguration,
        },
      }),
    store: makeStore(defaultedConfiguration),
  })
  instance.subscribe = subscribeFunction

  pullPolarStyleToShadow(shadowRoot, defaultedConfiguration.stylePath)
  pullVuetifyStyleToShadow(shadowRoot)
  setupFontawesome(shadowRoot, defaultedConfiguration.renderFaToLightDom)
  updateSizeOnReady(instance)

  // Restore theme ID such that external Vuetify app can find it again
  if (externalStylesheet) {
    externalStylesheet.id = 'vuetify-theme-stylesheet'
  }

  return instance
}
