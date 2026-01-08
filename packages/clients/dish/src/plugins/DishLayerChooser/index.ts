import Vue from 'vue'
import PolarPluginLayerChooser from '@polar/plugin-layer-chooser'
import { LayerChooserConfiguration } from '@polar/lib-custom-types'

export interface DishLayerChooserConfig extends LayerChooserConfiguration {
  layerDependencies?: Record<string, string[]>
}

export default (options: DishLayerChooserConfig) => (instance: Vue) => {
  console.log(
    '### LayerChooser Plugin mit Dish Erweiterung wird hinzugefügt.',
    options
  )
  const layerChooserPlugin = PolarPluginLayerChooser(options)
  layerChooserPlugin(instance)

  const store = instance.$store

  // Debug: Auf die richtige State zugreifen
  const state = store?._vm?.$data?.$$state
  console.log('### Actual state:', state)
  console.log('### LayerChooser State:', state?.plugin?.layerChooser)
  console.log('### instance.$watch existiert:', typeof instance.$watch)

  // Watcher auf activeMaskIds
  if (state?.plugin?.layerChooser) {
    console.log('### ✅ Starte Watcher auf activeMaskIds')

    // Nutze direkt die Vue-Instanz oder store._vm
    const watcherInstance = instance.$watch ? instance : store._vm

    watcherInstance.$watch(
      () => state.plugin.layerChooser.activeMaskIds,
      (newVal, oldVal) => {
        console.log('### 🚨 activeMaskIds geändert:', {
          old: oldVal,
          new: newVal,
        })

        if (options.layerDependencies && newVal && Array.isArray(newVal)) {
          const enhancedPayload = [...newVal]

          newVal.forEach((layerId) => {
            const dependencies = options.layerDependencies[layerId] || []
            if (dependencies && Array.isArray(dependencies)) {
              enhancedPayload.push(...dependencies)
            }
          })

          console.log('### ✅ Abhängige Layer gefunden:', enhancedPayload)
          // Hier können Sie weitere Aktionen ausführen
          // z.B. store.commit('setActiveMaskIds', enhancedPayload)
        }
      },
      { deep: true }
    )
  }
}
