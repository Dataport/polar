import { ImageTile, Map } from 'ol'

const headerRegex = /{(?<key>[^=]+)=(?<value>[^}]+)}/gm

/**
 * A header is defined by `{key=value}` as part of the configured url of a service.
 * Note, that the parenthesis are necessary.
 */
function customLoader(tile: ImageTile, url: string) {
  const headers: HeadersInit = {}
  const src = url.replaceAll(headerRegex, (_, key, value) => {
    headers[key] = value
    return ''
  })

  fetch(src, { method: 'GET', headers })
    .then((response) =>
      response.ok
        ? response.blob()
        : response.text().then((msg) => {
            throw msg
          })
    )
    .then((blob) => {
      if (blob) {
        ;(tile.getImage() as HTMLImageElement).src = URL.createObjectURL(blob)
      }
    })
    .catch((e) => console.error('@polar/core', e))
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
      // @ts-expect-error | masterportalapi always produces layers including a source
      const source = layer.getSource()
      const headerRequired = source?.urls?.some((url) => headerRegex.test(url))
      if (headerRequired && typeof source.setTileLoadFunction === 'function') {
        source.setTileLoadFunction(customLoader)
        // @ts-expect-error | masterportalapi always produces layers including a source
        layer.setSource(source)
      }
    })
}
