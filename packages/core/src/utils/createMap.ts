import Vue from 'vue'
import vuetify from '../vuePlugins/vuetify'
import store from '../vuePlugins/vuex'
import language from '../language'
import { MapContainer } from '../components'
import { CreateOptions, MapInstance } from '../types'
import subscribeFunction from './subscribe'

/**
 * createMap handles plugging all the parts together to create a configured map.
 * This method is loosely based on
 * {@link https://github.com/vuetifyjs/vuetify/issues/7622#issuecomment-624500549}
 * to create a shadow-dom'd map client unaffected by css issues of the
 * run-time environment.
 */
export default function createMap({
  containerId,
  mapConfiguration,
}: CreateOptions): Promise<MapInstance> {
  const configuredVuetify = vuetify(mapConfiguration?.vuetify)

  // TODO: "checkOrCreateStyleElement", "styleEl" and "genStyleElement" are not defined on Theme
  //  -> Would the correct approach be to write a Polar type which include these or simply ignore it?
  configuredVuetify.framework.theme.checkOrCreateStyleElement = function () {
    if (!this.styleEl) this.genStyleElement()
    return Boolean(this.styleEl)
  }

  // find shadow host, create shadow root
  const waitTime = 500
  const maxAttempts = 10
  let shadowHost = document.getElementById(containerId)
  let counter = 0

  return new Promise((resolve, reject) => {
    const intervalId = setInterval(() => {
      if (!shadowHost) {
        if (counter >= maxAttempts) {
          clearInterval(intervalId)
          reject(
            new Error(`containerId "${containerId}" not found on website.
                        Map client won't render.
                        Giving up after ${counter} ${maxAttempts}.`)
          )
          return
        }
        console.error(
          `containerId "${containerId}" not found on website.
            Map client won't render.
            Retrying in ${waitTime}ms ...`
        )

        shadowHost = document.getElementById(containerId)
        counter++
      } else {
        clearInterval(intervalId)

        const shadowRoot = shadowHost.attachShadow({ mode: 'open' })

        // Monkey patch querySelector to properly find root element
        const { querySelector } = document
        document.querySelector = function (selector) {
          if (selector === '[data-app]') return shadowRoot
          return querySelector.call(this, selector)
        }

        // @ts-expect-error | 'TS2339: Property 'env' does not exist on type 'ImportMeta'.' - It does since we're using vite as a bundler.
        const devMode = import.meta.env.DEV
        // move polar css to Shadow DOM (customer has to import it)
        const attributeName = devMode ? 'style' : 'link'
        const stylesheets = [...document.getElementsByTagName(attributeName)]
        const stylesheetDataAttribute = devMode
          ? 'data-vite-dev-id'
          : 'data-polar'
        const polarStylesheets = stylesheets.filter((el) =>
          el.getAttribute(stylesheetDataAttribute)
        )
        if (polarStylesheets.length > 0) {
          polarStylesheets
            // NOTE: Nodes have to be cloned due to a browser bug https://stackoverflow.com/questions/62129243/external-font-does-not-load-when-link-is-loaded-from-inside-the-shadowdom
            .map((el) => el.cloneNode(true))
            .forEach((style) => shadowRoot.appendChild(style))
        } else {
          console.error(
            `core.createMap: Couldn't find required stylesheets, map won' render. ${
              devMode
                ? 'Something must have gone wrong with the setup. Please contact an administrator.'
                : 'Please add "data-polar" to the respective link-tag. The use value for the attribute can be chosen arbitrarily.'
            }`
          )
        }

        // create Vue instance
        const instance: MapInstance = new Vue({
          vuetify: configuredVuetify,
          store,
          i18n: language(mapConfiguration?.language),
          // use a fresh div injected to the shadow root
          el: shadowRoot.appendChild(document.createElement('div')),
          render: (createElement) =>
            createElement(MapContainer, {
              props: {
                mapConfiguration,
              },
            }),
        })

        // fetch vuetify style from document and pull it over to the shadow realm
        const vuetifyStyle = document.getElementById('vuetify-theme-stylesheet')
        // @ts-expect-error | "TS2345: Argument of type 'HTMLElement | null' is not assignable to parameter of type 'Node'. Type 'null' is not assignable to type 'Node'."
        shadowRoot.appendChild(vuetifyStyle)

        // also, we inject this method so the users may listen to store changes
        instance.subscribe = subscribeFunction

        /* NOTE
         *
         * Albeit the map will render without this in Firefox, it won't in Chromium-
         * based browsers. The map reports "No map visible because the map
         * container's width or height are 0.". However, if updating the map's size
         * after letting all other tasks in callback queue execute, the DOM is
         * prepared, and we're good to go.
         *
         * For some reason, we'll have to wait two callback queues sometimes.
         * The waiting is arbitrarily limited to 100 queues.
         */
        let countHackula = 0
        const hacktervalId = setInterval(() => {
          const size = instance.$store.getters.map.getSize()
          if (countHackula++ < 100 && (size[0] === 0 || size[1] === 0)) {
            instance.$store.getters.map.updateSize()
          } else {
            clearInterval(hacktervalId)
          }
        }, 0)

        resolve(instance)
      }
    }, waitTime)
  })
}
