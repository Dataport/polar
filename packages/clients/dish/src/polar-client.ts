/* eslint-disable @typescript-eslint/naming-convention */
import client, { MapInstance } from '@polar/core'
import merge from 'lodash.merge'
import { getWfsFeatures } from '@polar/lib-get-features'
import { getPointCoordinate } from '@polar/plugin-pins'
import { Feature } from 'ol'
import { FeatureCollection, Geometry, GeometryCollection } from 'geojson'
import { GeoJSON } from 'ol/format'
import { LayerConfiguration } from '@polar/lib-custom-types'
import packageInfo from '../package.json'
import { navigateToDenkmal } from './utils/navigateToDenkmal'
import { addPlugins } from './addPlugins'
import { services } from './services'
import { getMapConfiguration } from './mapConfigurations/mapConfig'
import { CONTENT_ENUM } from './plugins/Modal/store'
import './styles.css'
import selectionLayer from './selectionLayer'
import { DishUrlParams } from './types'
import {
  beschriftungService,
  labeledLayerServices,
  layerLabelMap,
} from './servicesIntern'
// eslint-disable-next-line no-console
console.log(`DISH map client running in version ${packageInfo.version}.`)

export default {
  createMap: async ({ containerId, mode, urlParams, configOverride }) => {
    addPlugins(client, mode)
    const layerConf = services(mode, urlParams)
    const mapConfiguration = getMapConfiguration(mode, urlParams)

    const map = await client.createMap({
      containerId,
      mapConfiguration: merge(
        {
          ...mapConfiguration,
          layerConf,
        },
        configOverride || {}
      ),
    })
    const parameters = new URL(document.location as unknown as string)
      .searchParams
    // using naming from backend to avoid multiple names for same thing
    const objektId = parameters.get('ObjektID')
    if (mode === 'INTERN') {
      subscribeToExportedMap(map)
      // watch for changes in activeMaskIds to update beschriftung layer
      watchActiveMaskIds(map)
      map.$store.commit('plugin/selectionObject/setObjectId', objektId)
      if (typeof objektId === 'string') {
        zoomToInternalFeature(map, objektId, urlParams)
      }
    } else if (typeof objektId === 'string' && mode === 'EXTERN') {
      navigateToDenkmal(map, objektId)
    }
    if (mode === 'EXTERN') {
      map.$store.commit('plugin/modal/setClosed', false)
    }
    // @ts-expect-error | intentionally expand window; no environment affected
    window.openBenutzungshinweise = function (isIntern = false) {
      map.$store.commit(
        'plugin/modal/setContent',
        isIntern ? CONTENT_ENUM.HINTSINTERN : CONTENT_ENUM.HINTS
      )
      map.$store.commit('plugin/modal/setClosed', false)
    }
  },
}

function subscribeToExportedMap(instance: MapInstance) {
  instance.subscribe('plugin/export/exportedMap', (screenshot) => {
    if (screenshot) {
      const newWindow = window.open()
      newWindow?.document.write(
        `<html><head><title>Kartenausgabe</title></head><body><img src="${screenshot}" alt="Screenshot"></body></html>`
      )
    }
  })
}

function zoomToInternalFeature(
  instance: MapInstance,
  objektId: string,
  urlParams: DishUrlParams
) {
  getWfsFeatures(null, `${urlParams.internServicesBaseUrl}/wfs`, objektId, {
    fieldName: 'objektid',
    featurePrefix: 'app',
    typeName: 'TBLGIS_ORA',
    xmlns: 'http://www.deegree.org/app',
    useRightHandWildcard: false,
  })
    .then((featureCollection: FeatureCollection) => {
      const { features } = featureCollection
      if (features.length === 0) {
        throw Error(`No features for ID ${objektId} found.`)
      }
      if (features.length > 1) {
        console.warn(
          `@polar/client-dish: More than one feature found for id ${objektId}. Arbitrarily using first-returned.`
        )
      }
      const feature = features[0]
      const geometry = feature.geometry as Exclude<Geometry, GeometryCollection>
      const centerCoord = getPointCoordinate(
        'EPSG:25832',
        'EPSG:25832',
        geometry.type,
        geometry.coordinates
      )
      instance.$store.getters.map.getView().setCenter(centerCoord)
      instance.$store.getters.map.getView().setZoom(9)
      selectionLayer
        .getSource()
        ?.addFeature(new GeoJSON().readFeature(feature) as Feature)
      instance.$store.getters.map.addLayer(selectionLayer)
    })
    .catch((error) => {
      console.error('@polar/client-dish', error)
      instance.$store.dispatch('plugin/toast/addToast', {
        type: 'warning',
        text: 'dish.idNotFound',
      })
    })
}

function getOlLabelLayer(instance: MapInstance) {
  const map = instance.$store.getters.map
  return map
    .getLayers()
    .getArray()
    .find((l) => l.get('id') === beschriftungService.id)
}

function watchActiveMaskIds(instance: MapInstance) {
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
    updateLabelLayers
    { immediate: true }
  )
}

function getAllActiveLabelLayers(
  activeLayerIds: Record<string, string[]>,
  activeMaskIds: string[]
) {
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
      return layerLabelMap.get(l)
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
  masks: LayerConfiguration[],
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
