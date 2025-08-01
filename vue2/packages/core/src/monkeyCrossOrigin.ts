import { Map } from 'ol'
import { ImageWMS } from 'ol/source'

// TODO: Check whether this is still needed for the export plugin

// NOTE: This is needed to be able to properly use the export

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
      // @ts-expect-error | Set private param for ol class ImageWMS to prevent error in canvas rendering.
      // Might break after ol upgrade because its undocumented.
      if (source instanceof ImageWMS) source.crossOrigin_ = 'anonymous'
      else source.crossOrigin = 'anonymous'
      // @ts-expect-error | All layers here are instantiated layers including a source.
      layer.setSource(source)
    })
}
