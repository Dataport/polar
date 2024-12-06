import { Feature as GeoJsonFeature } from 'geojson'
import { FeaturesByLayerId } from '../types'

export function filterFeatures(
  featuresByLayerId: FeaturesByLayerId
): Record<string, GeoJsonFeature[]> {
  const entries = Object.entries(featuresByLayerId)
  const filtered = entries.filter((keyValue) => Array.isArray(keyValue[1])) as [
    string,
    GeoJsonFeature[]
  ][]
  return Object.fromEntries(filtered)
}
