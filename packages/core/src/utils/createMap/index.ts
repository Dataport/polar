import Vue from 'vue'
import { MasterportalApiConfig } from '@polar/lib-custom-types'
import { makeStore } from '../../vuePlugins/vuex'
import vuetify from '../../vuePlugins/vuetify'
import language from '../../language'
import { MapContainer } from '../../components'
import { CreateOptions, MapInstance } from '../../types'
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

  await language(mapConfiguration?.language)

  const mpapiDefaults: Partial<MasterportalApiConfig> = {
    epsg: 'EPSG:25832',
    backgroundImage: '',
    options: [
      { resolution: 66.14579761460263, scale: 250000, zoomLevel: 0 },
      { resolution: 26.458319045841044, scale: 100000, zoomLevel: 1 },
      { resolution: 15.874991427504629, scale: 60000, zoomLevel: 2 },
      { resolution: 10.583327618336419, scale: 40000, zoomLevel: 3 },
      { resolution: 5.2916638091682096, scale: 20000, zoomLevel: 4 },
      { resolution: 2.6458319045841048, scale: 10000, zoomLevel: 5 },
      { resolution: 1.3229159522920524, scale: 5000, zoomLevel: 6 },
      { resolution: 0.6614579761460262, scale: 2500, zoomLevel: 7 },
      { resolution: 0.2645831904584105, scale: 1000, zoomLevel: 8 },
      { resolution: 0.1322915952292052, scale: 500, zoomLevel: 9 },
    ],
    namedProjections: [
      [
        'EPSG:25832',
        '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      ],
      [
        'EPSG:3857',
        '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs',
      ],
      [
        'EPSG:4326',
        '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',
      ],
      [
        'EPSG:31467',
        '+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +nadgrids=BETA2007.gsb +units=m +no_defs +type=crs',
      ],
    ],
    startResolution: 15.874991427504629,
  }

  const instance: MapInstance = new Vue({
    vuetify: vuetify(mapConfiguration?.vuetify),
    el: shadowRoot.appendChild(document.createElement('div')),
    render: (createElement) =>
      createElement(MapContainer, {
        props: {
          mapConfiguration: { ...mpapiDefaults, ...mapConfiguration },
        },
      }),
    store: makeStore(),
  })
  instance.subscribe = subscribeFunction

  pullPolarStyleToShadow(shadowRoot, mapConfiguration.stylePath)
  pullVuetifyStyleToShadow(shadowRoot)
  setupFontawesome(shadowRoot, mapConfiguration.renderFaToLightDom)
  updateSizeOnReady(instance)

  return instance
}
