export default function positionChanged(
  oldPosition: number[],
  newPosition: number[]
): boolean {
  return oldPosition[0] !== newPosition[0] || oldPosition[1] !== newPosition[1]
}
