import { PolarGeoJsonFeature } from '../types'
import { getBlocks } from './match'

const sortOptions = (optionA, optionB) => {
  // prefer best fit
  if (optionA.fillPercentage > optionB.fillPercentage) return -1
  if (optionA.fillPercentage < optionB.fillPercentage) return 1
  // prefer longest fit of best fits
  if (optionA.keys.length > optionB.keys.length) return -1
  if (optionA.keys.length < optionB.keys.length) return 1
  // masterworks all, you can't go wrong
  if (optionA.index > optionB.index) return -1
  if (optionA.index < optionB.index) return 1
  // this never happens, until it does
  return 0
}

/**
 * identifies the best-matching search pattern and fills it with found values
 */
export const getFeatureTitleFromPattern = (
  feature: PolarGeoJsonFeature,
  patterns: string[]
): string => {
  const properties = feature.properties || {}
  const comparableOptions = patterns.map((pattern, index) => {
    const blocks = getBlocks(pattern)
    const keys = blocks.reduce(
      (keyAccumulator, block) =>
        Array.isArray(block) ? [...keyAccumulator, block[1]] : keyAccumulator,
      []
    ) as string[]
    const foundKeys = keys.reduce(
      (sum, key) =>
        typeof properties[key] !== 'undefined' && properties[key] !== ''
          ? sum + 1
          : sum,
      0
    )
    return {
      pattern,
      keys,
      index,
      fillPercentage: foundKeys / keys.length,
    }
  })

  const sortedOptions = [...comparableOptions].sort(sortOptions)

  const bestOption = sortedOptions[0]

  const filledPattern = bestOption.keys.reduce(
    (fillPattern, key) =>
      fillPattern.replace(`{{${key}}}`, properties[key] || ''),
    bestOption.pattern
  )

  return filledPattern
}
