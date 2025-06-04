import { PluginContainer } from '@polar/lib-custom-types'

export function sortPlugins(
  components: PluginContainer[],
  tag: string
): PluginContainer[] {
  const sortedComponents: PluginContainer[] = []
  for (let i = 0; i < components.length; i++) {
    if (components[i].options.layoutTag === tag) {
      sortedComponents.push(components[i])
    }
  }
  return sortedComponents
}
