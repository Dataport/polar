import { Map } from 'ol'

export function getCanvasFromMap(map: Map): HTMLCanvasElement {
	const viewport = map.getViewport()
	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')

	if (!context) {
		throw new Error('2D context not available')
	}

	canvas.width = viewport.clientWidth
	canvas.height = viewport.clientHeight

	const layerCanvases = viewport.querySelectorAll('.ol-layer canvas')
	layerCanvases.forEach((layerCanvas) => {
		const canvas = layerCanvas as HTMLCanvasElement
		if (canvas.width > 0) {
			// Handle layer opacity
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
			console.warn('@polar/plugin-export: canvas width is 0.')
		}
	})
	return canvas
}
