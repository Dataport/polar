let initialCreateMap = null

export default function addPlugins(this, plugins) {
  const originalCreateMap = this.createMap
  if (!initialCreateMap) {
    initialCreateMap = originalCreateMap
  }
  this.createMap = async (params) => {
    try {
      const instance = await originalCreateMap(params)
      plugins.forEach((initializePlugin) => initializePlugin(instance))
      return instance
    } catch (error) {
      console.error('@polar/core: Map creation failed.', error)
    }
  }
}

export function resetPlugins(this) {
  if (initialCreateMap) {
    this.createMap = initialCreateMap
    initialCreateMap = null
  }
}
