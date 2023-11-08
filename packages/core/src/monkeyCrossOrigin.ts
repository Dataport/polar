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
    .array_ // Change layers with wrong crossOrigin
    .forEach((layer) => {
      const source = layer.getSource()
      source.crossOrigin = 'anonymous'
      layer.setSource(source)
    })
}
