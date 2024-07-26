import { FeatureCollection } from 'geojson'
import { TextLocatorCategories, TreeViewItem } from '../types'
import { TitleLocationFrequency } from '../../../utils/literatureByToponym'

const sortByCount = (a: TreeViewItem, b: TreeViewItem) => b.count - a.count

const invertOrder = (
  byTextTreeViewItems: TreeViewItem[],
  featureCollection: FeatureCollection
): TreeViewItem[] => {
  const idRegister = new Set()

  // in case of toponym sorting, reverse the tree
  return featureCollection.features
    .map(
      (feature): TreeViewItem => ({
        id: String(feature.id),
        name: feature.properties?.title,
        feature,
        count: byTextTreeViewItems
          .map(
            (item) =>
              item.children?.find((child) => child.id === feature.id)?.count ||
              0
          )
          .reduce((acc, curr) => acc + curr, 0),
        children: byTextTreeViewItems
          .filter((item) =>
            item.children?.find((child) => child.id === feature.id)
          )
          .map((item) => ({ ...item, children: undefined }))
          .sort(sortByCount),
        type: 'toponym',
      })
    )
    .filter((item) => {
      // duplicate removal
      if (idRegister.has(item.id)) {
        return false
      }
      idRegister.add(item.id)
      return true
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
