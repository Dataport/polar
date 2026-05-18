import { Map } from 'ol'

export function getCanvasFromMap(map: Map) {
	const viewport = map.getViewport()
	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')

	if (!context) {
		throw new Error('2D context not available')
	}

	canvas.width = viewport.clientWidth
	canvas.height = viewport.clientHeight

	const layerCanvases: NodeListOf<HTMLCanvasElement> =
		viewport.querySelectorAll('.ol-layer canvas')
	layerCanvases.forEach((layerCanvas) => {
		const canvas = layerCanvas
		if (canvas.width > 0) {
			// use layer opacity for printing
			const opacity = (canvas.parentNode as HTMLElement).style.opacity
			context.globalAlpha = opacity === '' ? 1 : Number(opacity)

			// Get the transform parameters from the style's transform matrix
			const transform = canvas.style.transform
			const matrixMatch = transform.match(/^matrix\(([^(]*)\)$/)
			if (matrixMatch && matrixMatch[1]) {
				const matrix = matrixMatch[1].split(',').map(Number)
				context.setTransform(
					...(matrix as [number, number, number, number, number, number])
				)
			}

			context.drawImage(canvas, 0, 0)
		} else {
			console.error('Canvas width is 0, remains effectively empty.')
		}
	})
	return canvas
}
