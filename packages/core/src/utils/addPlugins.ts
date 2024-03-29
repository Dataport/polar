export default function addPlugins(this, plugins) {
  const originalCreateMap = this.createMap
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
