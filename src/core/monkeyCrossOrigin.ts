import { Map } from 'ol'
import { ImageWMS } from 'ol/source'

// NOTE: This is needed to be able to properly use the export plugin.

// eslint-disable-next-line @typescript-eslint/unbound-method
const originalAddLayer = Map.prototype.addLayer
// Monkey patch
Map.prototype.addLayer = function (...parameters) {
	// Add layer to map
	originalAddLayer.call(this, ...parameters)
	// Change all layers to be crossOrigin safe to prevent canvas tainting.
	Map.prototype.getLayers
		.call(this)
		.getArray()
		.forEach((layer) => {
			// @ts-expect-error | All layers here have a source
			const source = layer.getSource()

			if (!source) {
				return
			}
			// Might break after ol upgrade because its undocumented.
			if (source instanceof ImageWMS) {
				// @ts-expect-error | Set private param for ol class ImageWMS.
				source.crossOrigin_ = 'anonymous'
			} else {
				source.crossOrigin = 'anonymous'
			}
			// @ts-expect-error | All layers here are instantiated layers including a source
			layer.setSource(source)
		})
}
