import { TextLocatorCategories, TreeViewItem } from '../types'
import { TitleLocationFrequency } from '../../../utils/literatureByToponym'

export const makeTreeView = (
  titleLocationFrequency: TitleLocationFrequency,
  byCategory: TextLocatorCategories
): TreeViewItem[] => {
  const byTextTreeViewItems: TreeViewItem[] = Object.entries(
    titleLocationFrequency
  ).map(([title, locations]) => ({
    id: title, // TODO additional ID requested; switch when available
    name: title,
    count: Object.values(locations).reduce((acc, curr) => acc + curr),
    type: 'text',
    children: Object.entries(locations).map(([location, count]) => ({
      id: location, // TODO additional ID requested; switch when available
      name: location,
      count,
      type: 'toponym',
    })),
  }))

  if (byCategory === 'text') {
    return byTextTreeViewItems
  }

  // in case of toponym sorting, reverse the tree
  const locationNames = [
    ...new Set(
      byTextTreeViewItems
        .map((item) => (item.children || []).map((child) => child.name).flat(1))
        .flat(1)
    ),
  ]

  return locationNames.map((locationName) => ({
    id: locationName,
    name: locationName,
    count: byTextTreeViewItems
      .map(
        (item) =>
          item.children?.find((child) => child.name === locationName)?.count ||
          0
      )
      .reduce((acc, curr) => acc + curr),
    children: byTextTreeViewItems
      .filter((item) =>
        item.children?.find((child) => child.name === locationName)
      )
      .map((item) => ({ ...item, children: undefined })),
    type: 'toponym',
  }))
}
