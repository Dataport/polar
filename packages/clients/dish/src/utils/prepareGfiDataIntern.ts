export const prepareData = (
  currentProperties: Record<string, string>,
  orderedFields: Array<{ key: string; label: string }>
): Array<string[]> => {
  return orderedFields
    .map(({ key, label }) => [label, currentProperties[key]])
    .filter(([value]) => value !== undefined && value !== '')
}

export const createComposedField = (
  infoFields: Array<string>,
  currentProperties: Record<string, string>,
  label: string
) => {
  const composedDataField = infoFields
    .map((field) => currentProperties[field])
    .filter((value) => value)
    .join(' ')
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
