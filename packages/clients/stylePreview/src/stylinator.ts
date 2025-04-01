import { Feature, Map } from 'ol'
import { Polygon } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Fill, Stroke, Style } from 'ol/style'

const keyMap = {
  fill: Fill,
  stroke: Stroke,
}

const center = (map: Map, feature: Feature<Polygon>) => () => {
  const center = map.getView().getCenter() || [0, 0]
  feature.getGeometry()?.setCoordinates([
    [
      [center[0] - 2000, center[1] - 1000],
      [center[0] + 2000, center[1] - 1000],
      [center[0] + 2000, center[1] + 1000],
      [center[0] - 2000, center[1] + 1000],
    ],
  ])
}

const buildStyle = (style) =>
  typeof style === 'object'
    ? Object.entries(style).reduce((accumulator, [key, value]) => {
        console.error(key, value)
        if (keyMap[key]) {
          accumulator[key] = new keyMap[key](buildStyle(value))
        } else {
          accumulator[key] = buildStyle(value)
        }
        return accumulator
      }, {})
    : style

const setStyle = (feature: Feature) => (style) =>
  feature.setStyle(new Style(buildStyle(style)))

export const addStylePreview = (mapInstance) => {
  const map: Map = mapInstance.$store.getters.map

  const source = new VectorSource()
  const layer = new VectorLayer({
    source,
  })
  const feature = new Feature({
    geometry: new Polygon([]),
  })
  setStyle(feature)({
    fill: {
      color: 'rgba(255, 255, 255, 0.4)',
    },
    stroke: {
      color: '#3399CC',
      width: 1.25,
    },
  })

  source.addFeature(feature)

  map.addLayer(layer)

  map.on('moveend', center(map, feature))
  center(map, feature)()

  mapInstance.setStyle = setStyle(feature)

  return mapInstance
}
