import beautifyScale from './beautifyScale'

function getBestMatchingScale(
  scaleValue: number,
  zoomOptions: { resolution: number; scale: number; zoomLevel: number }[]
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
