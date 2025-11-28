import Polygon from 'ol/geom/Polygon'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import { jenfeldCoordinates } from '../jenfeld'

const jenfeldBoundaryPolygon = new Polygon(jenfeldCoordinates)
const simplifiedBoundary = (
  jenfeldBoundaryPolygon.simplify(5) as Polygon
).getCoordinates()[0]

export function clipWithJenfeldBoundary(map: Map) {
  const backgroundLayers = map
    .getLayers()
    .getArray()
    .filter((l) => l.get('type') !== 'mask') as TileLayer[]

  backgroundLayers.forEach((layer) => {
    layer.on('prerender', (event) => {
      if (!layer.getVisible() || !event.context) {
        return
      }

      const pixelCoords = simplifiedBoundary.map((coord) =>
        map.getPixelFromCoordinate(coord)
      )

      const context = event.context as CanvasRenderingContext2D
      context.save()

      context.beginPath()
      context.moveTo(pixelCoords[0][0], pixelCoords[0][1])
      for (let i = 1; i < pixelCoords.length; i++) {
        context.lineTo(pixelCoords[i][0], pixelCoords[i][1])
      }
      context.closePath()
      context.clip()
    })

    layer.on('postrender', (event) => {
      if (!layer.getVisible() || !event.context) {
        return
      }

      ;(event.context as CanvasRenderingContext2D).restore()
    })
  })
}
