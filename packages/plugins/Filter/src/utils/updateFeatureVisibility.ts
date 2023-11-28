import { Feature, Map } from 'ol'
import Style from 'ol/style/Style'
import { FilterConfiguration } from '@polar/lib-custom-types'
import { DatePattern, FilterState, LayerId, TimeOption } from '../types'

// comparable style to identify elements *supposed* to be invisible
export const Invisible = new Style()

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
    limits[1] = limits[0]
  }
  return limits
}

const getDateFromValue = (
  propertyValue: string,
  pattern: DatePattern
): Date => {
  const yearIndices = []
  const monthIndices = []
  const dayIndices = []
  const indiceLookup = {
    Y: yearIndices,
    M: monthIndices,
    D: dayIndices,
  }
  ;[...pattern].forEach((letter, index) => indiceLookup[letter]?.push?.(index))
  function getFromPropertyValue(index) {
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
  if (!time || time[layerId].radioId === 0) {
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
  }[unit]
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
  limits[1].setHours(24, 0, 0, 0)

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
  const layer = map
    .getLayers()
    .getArray()
    .find((layer) => layer.get('id') === layerId)
  if (!layer) {
    throw new Error(
      `Layer ${layerId} undefined in Filter.utils.updateFeatureVisibility.`
    )
  }
  layer
    // @ts-expect-error | only layers with getSource allowed
    .getSource()
    .getFeatures()
    .forEach((feature) => {
      feature.setStyle(
        doesFeaturePassFilter(feature, state, categories, layerId, timeOptions)
          ? undefined
          : Invisible
      )
    })
}
