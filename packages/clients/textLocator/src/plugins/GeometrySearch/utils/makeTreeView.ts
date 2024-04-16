import { FeatureCollection } from 'geojson'
import { TextLocatorCategories, TreeViewItem } from '../types'
import { TitleLocationFrequency } from '../../../utils/literatureByToponym'

const sortByCount = (a: TreeViewItem, b: TreeViewItem) => b.count - a.count

const invertOrder = (
  byTextTreeViewItems: TreeViewItem[],
  featureCollection: FeatureCollection
): TreeViewItem[] => {
  // in case of toponym sorting, reverse the tree
  const locationIds = [
    ...new Set(
      byTextTreeViewItems
        .map((item) => (item.children || []).map((child) => child.id).flat(1))
        .flat(1)
    ),
  ]

  return locationIds
    .map((locationId): TreeViewItem => {
      const feature = featureCollection.features.find(
        (feature) => feature.id === locationId
      )
      const locationName = feature?.properties?.title

      return {
        id: locationId,
        name: locationName,
        feature,
        count: byTextTreeViewItems
          .map(
            (item) =>
              item.children?.find((child) => child.name === locationName)
                ?.count || 0
          )
          .reduce((acc, curr) => acc + curr),
        children: byTextTreeViewItems
          .filter((item) =>
            item.children?.find((child) => child.name === locationName)
          )
          .map((item) => ({ ...item, children: undefined }))
          .sort(sortByCount),
        type: 'toponym',
      }
    })
    .sort(sortByCount)
}

export const makeTreeView = (
  titleLocationFrequency: TitleLocationFrequency,
  byCategory: TextLocatorCategories,
  featureCollection: FeatureCollection
): TreeViewItem[] => {
  const byTextTreeViewItems: TreeViewItem[] = Object.entries(
    titleLocationFrequency
  )
    .map(
      ([title, locations]): TreeViewItem => ({
        id: title, // TODO additional ID requested; switch when available
        name: title,
        count: Object.values(locations).reduce((acc, curr) => acc + curr),
        type: 'text',
        children: Object.entries(locations)
          .map(([locationId, count]): TreeViewItem => {
            const feature = featureCollection.features.find(
              (feature) => feature.id === locationId
            )
            return {
              id: locationId,
              name: featureCollection.features.find(
                (feature) => feature.id === locationId
              )?.properties?.title,
              feature,
              count,
              type: 'toponym',
            }
          })
          .sort(sortByCount),
      })
    )
    .sort(sortByCount)

  return byCategory === 'text'
    ? byTextTreeViewItems
    : invertOrder(byTextTreeViewItems, featureCollection)
}
