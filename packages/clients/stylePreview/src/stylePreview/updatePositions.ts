import { Map } from 'ol'
import { features as feats } from './features'

export const updatePositions = (map: Map, features: typeof feats) => () => {
  const center = map.getView().getCenter() || [0, 0]
  features.point
    .getGeometry()
    ?.setCoordinates([center[0] - 1000, center[1] + 1000])
  features.lineString.getGeometry()?.setCoordinates([
    [center[0] + 500, center[1] + 500],
    [center[0] + 1000, center[1] + 1500],
    [center[0] + 1500, center[1] + 500],
    [center[0] + 3000, center[1] + 2500],
  ])
  features.polygon.getGeometry()?.setCoordinates([
    [
      [center[0] - 2000, center[1] - 500],
      [center[0] - 500, center[1] - 1000],
      [center[0], center[1] - 2500],
      [center[0] - 2500, center[1] - 2000],
    ],
  ])
  features.text.getGeometry()?.setCoordinates([
    [center[0] + 1000, center[1] - 1000],
    [center[0] + 3000, center[1] - 3000],
  ])
}
