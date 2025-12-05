export const positionChanged = (oldPosition: number[], newPosition: number[]) =>
	oldPosition[0] !== newPosition[0] || oldPosition[1] !== newPosition[1]
