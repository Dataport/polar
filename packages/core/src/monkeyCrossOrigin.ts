import { Map } from 'ol'

// Original addLayer method
const originalAddLayer = Map.prototype.addLayer
// Monkey patch
Map.prototype.addLayer = function (...parameters) {
  // Add layer to map
  originalAddLayer.call(this, ...parameters)
  // Change all layers to be crossOrigin safe
  Map.prototype.getLayers
    .call(this)
    .getArray() // Change layers with wrong crossOrigin
    .forEach((layer) => {
      // @ts-expect-error | All layers here are instantiated layers including a source.
      const source = layer.getSource()
      source.crossOrigin = 'anonymous'
      // @ts-expect-error | All layers here are instantiated layers including a source.
      layer.setSource(source)
    })
}
