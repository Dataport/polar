import type { ExportFormat } from '../types'

export function convertCanvasToBase64(
	canvas: HTMLCanvasElement,
	type: ExportFormat
): string {
	try {
		const mimeType = type === 'png' ? 'image/png' : 'image/jpeg'
		const base64String = canvas.toDataURL(mimeType)
		return base64String
	} catch (error) {
		console.error('Screenshot export failed:', error)
		throw error
	}
}
