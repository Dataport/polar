/* eslint-disable @typescript-eslint/no-non-null-assertion */
import polarCore from '@polar/core'
import { changeLanguage } from 'i18next'
// NOTE bad pattern, but probably fine for a test client
import { enableClustering } from '../../meldemichel/src/utils/enableClustering'
import { addPlugins } from './addPlugins'
import { flurstuecke, mapConfiguration, reports } from './mapConfiguration'
import { exampleFeatureInformation } from './exampleFeatureInformation'
import { validateForm } from './validateForm'

addPlugins(polarCore)

const createMap = (layerConf) => {
  // NOTE This seems to be missing in the layer specs
  const flurLayer = layerConf.find(({ id }) => id === flurstuecke)
  if (flurLayer) {
    flurLayer.crs = 'http://www.opengis.net/def/crs/EPSG/0/25832'
    flurLayer.bboxCrs = 'http://www.opengis.net/def/crs/EPSG/0/25832'
  }

  polarCore
    .createMap({
      containerId: 'polarstern',
      mapConfiguration: {
        ...mapConfiguration,
        layerConf: (enableClustering(layerConf, reports), layerConf),
      },
    })
    .then((map) => {
      // @ts-expect-error | adding it intentionally for e2e testing
      window.mapInstance = map

      const loginButton = document.getElementById(
        'login-button'
      ) as HTMLButtonElement
      loginButton.onclick = () =>
        validateForm((token) => map.$store.commit('setOidcToken', token))

      addStoreSubscriptions(
        ['plugin/zoom/zoomLevel', 'vuex-target-zoom'],
        [
          'plugin/gfi/featureInformation',
          'vuex-target-gfi',
          (featureInformation) => JSON.stringify(featureInformation, null, 2),
        ],
        ['plugin/pins/transformedCoordinate', 'vuex-target-pin-coordinate'],
        [
          'plugin/addressSearch/chosenAddress',
          'vuex-target-address-search-result',
          (address) => JSON.stringify(address, null, 2),
        ],
        [
          'plugin/export/exportedMap',
          null,
          (screenshot) =>
            document
              .getElementById('vuex-target-export-result')!
              .setAttribute('src', screenshot),
        ],
        [
          'plugin/draw/featureCollection',
          'vuex-target-draw-result',
          (featureCollection) => JSON.stringify(featureCollection, null, 2),
        ],
        [
          'plugin/draw/revisedFeatureCollection',
          'vuex-target-draw-revision-result',
          (featureCollection) => JSON.stringify(featureCollection, null, 2),
        ]
      )(map)
    })
}

const addStoreSubscriptions =
  (...subscriptions) =>
  (map) =>
    subscriptions.forEach(([actionName, targetId, callback = (x) => x]) =>
      map.subscribe(actionName, (value) =>
        targetId
          ? (document.getElementById(targetId)!.innerHTML = callback(value))
          : callback(value)
      )
    )

polarCore.rawLayerList.initializeLayerList(
  // using hamburg's service register as an example
  'https://geodienste.hamburg.de/services-internet.json',
  createMap
)

/* simple language switcher attached for demo purposes;
 * language switching is considered a global concern and
 * should be handled by the leading application */
document
  .getElementById('language-switcher')!
  .addEventListener('change', (event) => {
    const target = event.target as HTMLOptionElement
    const { value } = target
    changeLanguage(value).then(() => {
      target[0].innerHTML = value === 'en' ? 'English' : 'Englisch'
      target[1].innerHTML = value === 'en' ? 'German' : 'Deutsch'
    })
  })

document.getElementById('vuex-target-clicky')!.addEventListener('click', () =>
  // @ts-expect-error | added for e2e testing
  window.mapInstance.$store.dispatch(
    'plugin/gfi/setFeatureInformation',
    exampleFeatureInformation
  )
)
