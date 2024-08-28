export default function positionChanged(
  position: number[],
  transformedCoords: number[]
): boolean {
  return (
    position[0] !== transformedCoords[0] || position[1] !== transformedCoords[1]
  )
}
