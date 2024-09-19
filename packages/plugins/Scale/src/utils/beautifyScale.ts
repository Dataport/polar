/**
 * Rounds the scale number so that the scale can be displayed in a beautified format in the map.
 * @param scaleNumber - the scale to be beautified
 * @returns the scale in a beautified format (=rounded based on its value)
 */
function beautifyScale(scaleNumber: number) {
  if (scaleNumber > 10000) {
    scaleNumber = Math.round(scaleNumber / 500) * 500
  } else if (scaleNumber > 1000) {
    scaleNumber = Math.round(scaleNumber / 50) * 50
  }
  return scaleNumber
}

export default beautifyScale
