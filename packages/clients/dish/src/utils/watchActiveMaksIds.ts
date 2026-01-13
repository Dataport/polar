import { MapInstance } from '@polar/core'
import {
  beschriftungService,
  labeledLayerServices,
  layerLabelMap,
} from '../servicesIntern'

function getOlLabelLayer(instance) {
  const map = instance.$store.getters.map
  return map
    .getLayers()
    .getArray()
    .find((l) => l.get('id') === beschriftungService.id)
}

export function watchActiveMaskIds(instance) {
  let previousLayers = ''

  const updateLabelLayers = () => {
    const activeLayerIds =
      instance.$store.getters['plugin/layerChooser/activeLayerIds']
    const activeMaskIds =
      instance.$store.getters['plugin/layerChooser/activeMaskIds']
    const masks = instance.$store.getters['plugin/layerChooser/masks']

    const allActiveLabelLayers = getAllActiveLabelLayers(
      activeLayerIds,
      activeMaskIds
    )
    const LAYERS = allActiveLabelLayers.join(',')

    if (LAYERS === previousLayers) {
      return
    }

    previousLayers = LAYERS

    if (LAYERS !== '') {
      updateBeschriftungsLayer(instance, LAYERS)
      setBeschriftungVisibilityInMenu(masks, instance, false)
    } else {
      setBeschriftungVisibilityInMenu(masks, instance, true)
      getOlLabelLayer(instance)?.setVisible(false)
    }
  }

  instance.$store.watch(
    (_, getters) => ({
      activeLayerIds: getters['plugin/layerChooser/activeLayerIds'],
      activeMaskIds: getters['plugin/layerChooser/activeMaskIds'],
    }),
    updateLabelLayers,
    { immediate: true }
  )
}

function getAllActiveLabelLayers(activeLayerIds, activeMaskIds) {
  const activeLabeledLayers = Object.entries(activeLayerIds)
    .filter(
      ([key]) =>
        labeledLayerServices.map((service) => service.id).includes(key) &&
        activeMaskIds.includes(key)
    )
    .map(([, value]) => value)
    .flat()
  return activeLabeledLayers
    .map((l) => {
      return layerLabelMap.get(l as string)
    })
    .filter((s) => s)
}

function updateBeschriftungsLayer(instance: MapInstance, LAYERS: string) {
  const olLabelLayer = getOlLabelLayer(instance)
  const olSource = olLabelLayer?.getSource()
  if (olSource) {
    const updatedParams = { ...olSource.getParams(), LAYERS }
    olSource.updateParams(updatedParams)
  }
}

function setBeschriftungVisibilityInMenu(
  masks,
  instance: MapInstance,
  hiddenInMenu: boolean
) {
  const masksArray = masks.map((mask) =>
    mask.id === beschriftungService.id
      ? { ...mask, hideInMenu: hiddenInMenu }
      : mask
  )
  instance.$store.commit('plugin/layerChooser/setMasks', masksArray)
}
