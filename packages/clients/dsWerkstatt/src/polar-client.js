import polarCore, { setLayout, NineLayout } from '@polar/core'
import { services } from './services'
import { addPlugins } from './addPlugins'

export function createMap(containerId, mapConfiguration) {
  setLayout(NineLayout)

  addPlugins(polarCore)

  // Setup vorgegeben durch @masterportal/masterportalApi
  // TODO: Falls in der Datei 'mapConfiguration' der Parameter 'layerConf' angepasst wurde, muss dies hier auch passieren.
  polarCore.rawLayerList.initializeLayerList(services)

  return polarCore.createMap({
    containerId,
    mapConfiguration,
  })
}
