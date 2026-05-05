import { type ExportFormat } from '../types'

export const downloadAsImage = (base64String: string, type: ExportFormat) => {
	const link = document.createElement('a')
	link.download = `polar-map.${type}`
	link.href = base64String
	link.style.display = 'none'
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}
