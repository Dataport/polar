import { Feature } from 'geojson'

export const sortFeaturesByProperties = (
  features: Feature[],
  sortKeys: string[],
  numericKeys: string[] = []
): Feature[] => {
  return features.sort((a, b) => {
    for (const key of sortKeys) {
      const valueA = a.properties?.[key] ?? ''
      const valueB = b.properties?.[key] ?? ''

      let comparison = 0

      if (numericKeys.includes(key)) {
        const numA = parseFloat(String(valueA)) || 0
        const numB = parseFloat(String(valueB)) || 0
        comparison = numA - numB
      } else {
        comparison = String(valueA).localeCompare(String(valueB))
      }

      if (comparison !== 0) {
        return comparison
      }
    }
    return 0
  })
}
