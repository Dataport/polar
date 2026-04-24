import { jsPDF } from 'jspdf'

// PDF options
const dims: Record<string, [number, number]> = {
	a0: [1189, 841],
	a1: [841, 594],
	a2: [594, 420],
	a3: [420, 297],
	a4: [297, 210],
	a5: [210, 148],
}

export const convertToPdf = (
	src: string,
	imgWidth: number,
	imgHeight: number
) => {
	// NOTE: when supporting more formats, scale map accordingly
	const format = 'a4'
	const dim = dims[format] as [number, number]
  const jsPdf = new jsPDF('landscape', undefined, format) // eslint-disable-line

	// Fit image proportionally onto the page
	const pageWidth = dim[0]
	const pageHeight = dim[1]
	const ratio = imgWidth / imgHeight
	let drawWidth = pageWidth
	let drawHeight = pageWidth / ratio
	if (drawHeight > pageHeight) {
		drawHeight = pageHeight
		drawWidth = pageHeight * ratio
	}
	const x = (pageWidth - drawWidth) / 2
	const y = (pageHeight - drawHeight) / 2
	jsPdf.addImage(src, 'JPEG', x, y, drawWidth, drawHeight)

	return {
		pdfSrc: jsPdf.output('datauristring'),
		jsPdf,
	}
}
