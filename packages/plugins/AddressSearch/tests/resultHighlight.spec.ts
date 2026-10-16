import Map from 'ol/Map'
import View from 'ol/View'
import { Polygon } from 'ol/geom'
import { Style } from 'ol/style'
import { register } from 'ol/proj/proj4'
import proj4 from 'proj4'
import { Feature as GeoJsonFeature, Geometry } from 'geojson'
import {
  clearHighlight,
  createHighlightLayer,
  defaultHighlightStyle,
  showFeature,
} from '../src/utils/resultHighlight'

proj4.defs(
  'EPSG:25832',
  '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
)
register(proj4)

const ring = [
  [500000, 6000000],
  [500010, 6000000],
  [500010, 6000010],
  [500000, 6000000],
]

const withGeometry = (geometry: Geometry): GeoJsonFeature => ({
  type: 'Feature',
  properties: {},
  geometry,
})

const polygon = withGeometry({ type: 'Polygon', coordinates: [ring] })

const makeMap = (projection = 'EPSG:25832') =>
  new Map({ view: new View({ projection }) })

describe('AddressSearch result highlight', () => {
  it('creates an internal layer between GFI and pin layers', () => {
    const layer = createHighlightLayer()
    expect(layer.get('polarInternalId')).toBe(
      'pluginAddressSearchResultHighlight'
    )
    expect(layer.getZIndex()).toBe(95)
  })

  it('merges configured style with the default style', () => {
    const style = createHighlightLayer({
      stroke: { color: '#ff0000' },
    }).getStyle() as Style
    expect(style.getStroke()?.getColor()).toBe('#ff0000')
    expect(style.getStroke()?.getWidth()).toBe(
      defaultHighlightStyle.stroke.width
    )
    expect(style.getFill()?.getColor()).toBe(defaultHighlightStyle.fill.color)
  })

  it.each([
    ['Polygon', polygon],
    [
      'MultiPolygon',
      withGeometry({ type: 'MultiPolygon', coordinates: [[ring]] }),
    ],
    ['LineString', withGeometry({ type: 'LineString', coordinates: ring })],
    [
      'MultiLineString',
      withGeometry({ type: 'MultiLineString', coordinates: [ring] }),
    ],
  ])('highlights %s geometries', (_, feature) => {
    const layer = createHighlightLayer()
    showFeature(layer, feature, makeMap(), 'EPSG:25832')
    expect(layer.getSource()?.getFeatures()).toHaveLength(1)
  })

  it('replaces a previous highlight', () => {
    const layer = createHighlightLayer()
    const map = makeMap()
    showFeature(layer, polygon, map, 'EPSG:25832')
    showFeature(layer, polygon, map, 'EPSG:25832')
    expect(layer.getSource()?.getFeatures()).toHaveLength(1)
  })

  it.each([
    [
      'a point',
      withGeometry({ type: 'Point', coordinates: [500000, 6000000] }),
    ],
    [
      'a multipoint',
      withGeometry({ type: 'MultiPoint', coordinates: [[500000, 6000000]] }),
    ],
    ['null', null],
  ])('clears the highlight for %s', (_, feature) => {
    const layer = createHighlightLayer()
    const map = makeMap()
    showFeature(layer, polygon, map, 'EPSG:25832')
    showFeature(layer, feature, map, 'EPSG:25832')
    expect(layer.getSource()?.getFeatures()).toHaveLength(0)
  })

  it('clears the highlight explicitly', () => {
    const layer = createHighlightLayer()
    showFeature(layer, polygon, makeMap(), 'EPSG:25832')
    clearHighlight(layer)
    expect(layer.getSource()?.getFeatures()).toHaveLength(0)
  })

  it('transforms from the feature projection, falling back to the map EPSG', () => {
    const map = makeMap('EPSG:3857')
    // UTM zone 32 easting 500000 lies on 9° E, i.e. x ≈ 1001875.4 in EPSG:3857
    const firstX = (layer) =>
      (
        layer.getSource()?.getFeatures()[0].getGeometry() as Polygon
      ).getFirstCoordinate()[0]

    const fromFeature = createHighlightLayer()
    showFeature(
      fromFeature,
      { ...polygon, epsg: 'EPSG:25832' },
      map,
      'EPSG:4326'
    )
    expect(firstX(fromFeature)).toBeCloseTo(1001875.4, 0)

    const fromFallback = createHighlightLayer()
    showFeature(fromFallback, polygon, map, 'EPSG:25832')
    expect(firstX(fromFallback)).toBeCloseTo(1001875.4, 0)
  })
})
