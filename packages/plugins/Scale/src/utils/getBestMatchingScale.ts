import { PolarMapOptions } from '@polar/lib-custom-types'
import beautifyScale from './beautifyScale'

function getBestMatchingScale(
  scaleValue: number,
  zoomOptions: PolarMapOptions[]
): number {
  const scaleToCompare = beautifyScale(scaleValue)
  const bestMatchingScale = zoomOptions.reduce((prev, curr) => {
    return Math.abs(curr.scale - scaleToCompare) <
      Math.abs(prev.scale - scaleToCompare)
      ? curr
      : prev
  })
  return bestMatchingScale.scale
}

export default getBestMatchingScale
