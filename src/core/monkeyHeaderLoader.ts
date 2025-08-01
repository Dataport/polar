import { type ImageTile, Map } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { type TileWMS } from 'ol/source'

// NOTE: This monkey patch allows url parameters of tiled WMS layers to become headers if used like `{key=value}`

// @ts-expect-error | Most modern browsers already support named capturing groups. This should be fine.
const headerRegex = /{(?<key>[^=]+)=(?<value>[^}]+)}/gm

/**
 * A header is defined by `{key=value}` as part of the configured url of a service.
 * Note, that the parenthesis are necessary.
 */
function customLoader(tile: ImageTile, url: string) {
	const headers: HeadersInit = {}
	const src = url.replaceAll(headerRegex, (_, key: string, value: string) => {
		headers[key] = value
		return ''
	})

	fetch(src, { method: 'GET', headers })
		.then((response) =>
			response.ok
				? response.blob()
				: response.text().then((msg) => {
						throw new Error(msg)
					})
		)
		.then((blob) => {
			;(tile.getImage() as HTMLImageElement).src = URL.createObjectURL(blob)
		})
		.catch((e: unknown) => {
			console.error('@polar/core', e)
		})
}

// Original addLayer method
const originalAddLayer = Map.prototype.addLayer
// Monkey patch
Map.prototype.addLayer = function (...parameters) {
	// Add layer to map
	originalAddLayer.call(this, ...parameters)
	Map.prototype.getLayers
		.call(this)
		.getArray()
		.forEach((layer) => {
			if (!(layer instanceof TileLayer)) {
				return
			}
			const source = layer.getSource() as TileWMS
			// @ts-expect-error | urls is accessible and not protected here.
			const headerRequired = source.urls?.some((url: string) =>
				headerRegex.test(url)
			)
			if (headerRequired && typeof source.setTileLoadFunction === 'function') {
				// @ts-expect-error | only ImageTiles reach this point, generic class Tile is not used.
				source.setTileLoadFunction(customLoader)
				layer.setSource(source)
			}
		})
}
