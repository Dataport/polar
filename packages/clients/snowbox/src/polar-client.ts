/* eslint-disable @typescript-eslint/no-non-null-assertion */
import polarCore from '@polar/core'
import { changeLanguage } from 'i18next'
import { addPlugins } from './addPlugins'
import { mapConfiguration } from './mapConfiguration'

addPlugins(polarCore)

const createMap = (layerConf) => {
  polarCore
    .createMap({
      containerId: 'polarstern',
      mapConfiguration: {
        ...mapConfiguration,
        layerConf,
      },
    })
    .then(
      addStoreSubscriptions(
        ['plugin/zoom/zoomLevel', 'vuex-target-zoom'],
        ['plugin/measure/measure', 'vuex-target-measure'],
        ['plugin/measure/selectedUnit', 'vuex-target-unit'],
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
        ]
      )
    )
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
