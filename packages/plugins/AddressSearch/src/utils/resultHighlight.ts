import { Feature as GeoJsonFeature } from 'geojson'
import { HighlightStyle } from '@polar/lib-custom-types'
import Map from 'ol/Map'
import Feature from 'ol/Feature'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { Fill, Stroke, Style } from 'ol/style'

export const defaultHighlightStyle: HighlightStyle = {
  stroke: { color: '#003064', width: 3 },
  fill: { color: 'rgba(0, 48, 100, 0.15)' },
}

// Points are already marked by the Pins plugin.
const highlightableTypes = [
  'LineString',
  'MultiLineString',
  'Polygon',
  'MultiPolygon',
]

export function createHighlightLayer(
  style: Partial<HighlightStyle> = {}
): VectorLayer<VectorSource<Feature>> {
  const layer = new VectorLayer({
    source: new VectorSource<Feature>(),
    style: new Style({
      stroke: new Stroke({ ...defaultHighlightStyle.stroke, ...style.stroke }),
      fill: new Fill({ ...defaultHighlightStyle.fill, ...style.fill }),
    }),
  })
  layer.set('polarInternalId', 'pluginAddressSearchResultHighlight')
  layer.setZIndex(95)
  return layer
}

export function clearHighlight(
  layer: VectorLayer<VectorSource<Feature>>
): void {
  layer.getSource()?.clear()
}

/**
 * Replaces the highlighted geometry with the given feature's geometry.
 * Features without area or line geometry only clear the highlight.
 */
export function showFeature(
  layer: VectorLayer<VectorSource<Feature>>,
  feature: (GeoJsonFeature & { epsg?: string }) | null | undefined,
  map: Map,
  fallbackEpsg: string
): void {
  clearHighlight(layer)
  if (
    !feature?.geometry ||
    !highlightableTypes.includes(feature.geometry.type)
  ) {
    return
  }
  const geometry = new GeoJSON().readGeometry(feature.geometry, {
    dataProjection: feature.epsg || fallbackEpsg,
    featureProjection: map.getView().getProjection(),
  })
  layer.getSource()?.addFeature(new Feature({ geometry }))
}
