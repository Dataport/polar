/* eslint-disable @typescript-eslint/naming-convention */
import client, { MapInstance } from '@polar/core'
import merge from 'lodash.merge'
import { getWfsFeatures } from '@polar/lib-get-features'
import { getPointCoordinate } from '@polar/plugin-pins'
import { Feature } from 'ol'
import { FeatureCollection, Geometry, GeometryCollection } from 'geojson'
import { GeoJSON } from 'ol/format'
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
  servicesIntern,
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

function watchActiveMaskIds(instance: MapInstance) {
  instance.$store.watch(
    (_, getters) => getters['plugin/layerChooser/activeLayerIds'],
    (activeLayerIds) => {
      const activeLabeledLayers = Object.keys(activeLayerIds).filter((key) =>
        labeledLayerServices.map((service) => service.id).includes(key)
      )
      console.log('### activeLabeledLayers', activeLabeledLayers)
      instance.$store.dispatch(
        'plugin/layerChooser/toggleOpenedOptionsServiceLayer',
        activeLayerIds.join(','),
        {
          root: true,
        }
      )
    }
  )
  instance.$store.watch(
    (_, getters) => getters['plugin/layerChooser/activeMaskIds'],
    (activeMaskIds) => {
      const allActiveLabelLayers = activeMaskIds
        .filter((maskId: string) => {
          return labeledLayerServices.map((l) => l.id).includes(maskId)
        })
        .map((maskId: string) => {
          const subLayers = servicesIntern
            .find((s) => s.id === maskId)!
            .layers.split(',')

          console.error('subLayers', subLayers)

          const allActiveLabelLayers = subLayers
            .map(
              (notLabelLayer: string) => layerLabelMap.get(notLabelLayer) || ''
            )
            .filter((s) => s)
          return allActiveLabelLayers
        })
        .flat()

      console.error('allActiveLabelLayers', allActiveLabelLayers)

      const map = instance.$store.getters.map
      const olLabelLayer = map
        .getLayers()
        .getArray()
        .find((l) => l.get('id') === beschriftungService.id)

      const LAYERS = allActiveLabelLayers.join(',')

      // ^_^

      const olSource = olLabelLayer.getSource()
      const updatedParams = { ...olSource.getParams(), LAYERS }
      olSource.updateParams(updatedParams)

      // servicesIntern
      // layerLabelMap
    },
    { immediate: true }
  )
}
