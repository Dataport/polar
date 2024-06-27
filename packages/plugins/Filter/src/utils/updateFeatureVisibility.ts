import { Feature, Map } from 'ol'
import { InvisibleStyle } from '@polar/lib-invisible-style'
import { FilterConfiguration } from '@polar/lib-custom-types'
import ClusterSource from 'ol/source/Cluster'
import BaseLayer from 'ol/layer/Base'
import { DatePattern, FilterState, LayerId, TimeOption } from '../types'

const doesFeaturePassCategoryFilter = (
  categories: FilterConfiguration['layers'][string]['categories'],
  category: FilterState['category'],
  feature: Feature,
  layerId: LayerId
) =>
  (categories || []).every(
    ({ targetProperty }) =>
      category[layerId][targetProperty][feature.get(targetProperty)]
  )

const getFreeSelectionLimits = (clickLimits: Date[]): Date[] => {
  const limits = clickLimits
    .slice(0, 2)
    .sort()
    .map((x) => new Date(x))
  if (!limits[1]) {
    limits[1] = new Date(limits[0])
  }
  return limits
}

const getDateFromValue = (
  propertyValue: string,
  pattern: DatePattern
): Date => {
  const yearIndices: number[] = []
  const monthIndices: number[] = []
  const dayIndices: number[] = []
  const indexLookup = {
    Y: yearIndices,
    M: monthIndices,
    D: dayIndices,
  }
  ;[...pattern].forEach((letter, index) => indexLookup[letter]?.push?.(index))
  function getFromPropertyValue(index: number) {
    return propertyValue[index]
  }
  return new Date(
    Number(yearIndices.map(getFromPropertyValue).join('')),
    Number(monthIndices.map(getFromPropertyValue).join('')) - 1,
    Number(dayIndices.map(getFromPropertyValue).join(''))
  )
}

const doesFeaturePassTimeFilter = (
  layerId: LayerId,
  time: FilterState['time'],
  timeOptions: TimeOption[],
  feature: Feature
): boolean => {
  // radioId=0 means 'no restriction'
  if (!time || !time[layerId] || time[layerId].radioId === 0) {
    return true
  }
  const { targetProperty, radioId, pattern } = time[layerId]
  const selectedTimeFilter = timeOptions[radioId - 1]
  const propertyValue = feature.get(targetProperty)
  const featureDate = getDateFromValue(propertyValue, pattern)
  const { type, amount, unit } = selectedTimeFilter

  // only unit 'days' currently supported
  const unitMilliseconds = {
    days: 24 * 60 * 60 * 1000,
  }[unit || 'days']
  const limits: Date[] = []

  if (type === 'freeSelection') {
    const chosenLimits = time[layerId].freeSelection
    if (chosenLimits.length === 0) {
      // no limits selected? feature passes automatically
      return true
    }
    ;[limits[0], limits[1]] = getFreeSelectionLimits(chosenLimits)
  } else {
    limits[type === 'last' ? 0 : 1] = new Date(
      // @ts-expect-error | amount is number in last/next case
      Date.now() - amount * unitMilliseconds
    )
    limits[type === 'last' ? 1 : 0] = new Date(Date.now())
  }
  limits[0].setHours(0, 0, 0, 0)
  limits[1].setHours(23, 59, 59, 999)

  return limits[0] <= featureDate && featureDate <= limits[1]
}

const doesFeaturePassFilter = (
  feature: Feature,
  { category, time }: FilterState,
  categories: FilterConfiguration['layers'][string]['categories'],
  layerId: LayerId,
  timeOptions: TimeOption[]
): boolean => {
  if (
    category &&
    !doesFeaturePassCategoryFilter(categories, category, feature, layerId)
  ) {
    return false
  }

  return Boolean(
    time && doesFeaturePassTimeFilter(layerId, time, timeOptions, feature)
  )
}

const getLayer = (map: Map, layerId: LayerId): BaseLayer => {
  const layer = map
    .getLayers()
    .getArray()
    .find((layer) => layer.get('id') === layerId)
  if (!layer) {
    throw new Error(
      `Layer ${layerId} undefined in Filter.utils.updateFeatureVisibility.`
    )
  }
  return layer
}

export const updateFeatureVisibility = ({
  map,
  layerId,
  state,
  categories,
  timeOptions,
}: {
  map: Map
  layerId: LayerId
  state: FilterState
  categories: FilterConfiguration['layers'][string]['categories']
  timeOptions: TimeOption[]
}) => {
  const layer = getLayer(map, layerId)

  // @ts-expect-error | only layers with getSource allowed
  let source = layer.getSource()
  while (source instanceof ClusterSource) {
    source = source.getSource()
  }
  const updateFeatures = source
    .getFeatures()
    .map((feature) => feature.get('features') || [feature])
    .flat(1)
  // only update finally to prevent overly recalculating clusters
  source.clear()

  updateFeatures.forEach((feature) => {
    const targetStyle = doesFeaturePassFilter(
      feature,
      state,
      categories,
      layerId,
      timeOptions
    )
      ? null
      : InvisibleStyle
    if (feature.getStyle() !== targetStyle) {
      feature.setStyle(targetStyle)
    }
  })
  source.addFeatures(updateFeatures)
}
