import { GeoJsonProperties } from 'geojson'

export const prepareData = (
  currentProperties: GeoJsonProperties,
  orderedFields: Array<{ key: string; label: string }>
): Array<string[]> => {
  if (!currentProperties) return []
  return orderedFields
    .map(({ key, label }) => [label, currentProperties[key]])
    .filter(([value]) => value !== undefined && value !== '')
}

export const createComposedField = (
  infoFields: Array<string>,
  currentProperties: GeoJsonProperties,
  label: string,
  delimiter = ' '
) => {
  if (!currentProperties) return null
  const composedDataField = infoFields
    .map((field) => currentProperties[field])
    .filter((value) => value)
    .join(delimiter)
  if (!composedDataField || composedDataField.trim() === '') return null
  return [label, composedDataField]
}

export const addComposedField = (
  composedData: Array<string>,
  keyToInsertAfter: string,
  tableData: Array<string[]>
) => {
  const gemeindeIndex = tableData.findIndex(([key]) => key === keyToInsertAfter)
  tableData.splice(gemeindeIndex + 1, 0, composedData)
}
