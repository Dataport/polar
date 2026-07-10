import type { Map } from 'ol'

import { ImageWMS } from 'ol/source'

/**
 * Provides a monkey patch for cross-origin shenanigans. Please mind that this
 * solution is not compatible with some kinds of login. Should a case arise
 * where both an afflicted kind of login and the export plugin are to be used,
 * another solution must be found to this.
 */
export class CrossOriginMonkey {
	/** additional element for prototype chain to shadow addLayer */
	shadowingPrototype

	#setAllCrossOrigins = (map: Map, crossOrigin: 'anonymous' | null) =>
		Object.getPrototypeOf(this.shadowingPrototype)
			.getLayers.call(map)
			.getArray()
			.forEach((layer) => {
				const source = layer.getSource()

				if (!source) {
					return
				}

				// Brittle code, ready to break on any ol update and produce a nice bug. (づ๑•ᴗ•๑)づ🐞
				if (source instanceof ImageWMS) {
					// @ts-expect-error | Set private param for ol class ImageWMS.
					source.crossOrigin_ = crossOrigin
				} else {
					source.crossOrigin = crossOrigin
				}

				// trigger update
				layer.setSource(source)
				// NOTE(sende): oh no it doesn't untaint the canvas, so we can't print if it's added too late! ;_;
			})

	startBusiness(map: Map) {
		this.shadowingPrototype = Object.create(Object.getPrototypeOf(map))

		// Shadow Monkey patch
		this.shadowingPrototype.addLayer = (...parameters) => {
			Object.getPrototypeOf(this.shadowingPrototype).addLayer.call(
				map,
				...parameters
			)
			this.#setAllCrossOrigins(map, 'anonymous')
		}

		Object.setPrototypeOf(map, this.shadowingPrototype)

		// to get all already existing layers (in case plugin was added later)
		this.#setAllCrossOrigins(map, 'anonymous')
	}

	stopBusiness(map: Map) {
		Object.setPrototypeOf(map, Object.getPrototypeOf(this.shadowingPrototype))
		this.#setAllCrossOrigins(map, null)
	}
}
