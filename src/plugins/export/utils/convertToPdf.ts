import { jsPDF as JSpdf } from 'jspdf'

type DINmension = 'a0' | 'a1' | 'a2' | 'a3' | 'a4' | 'a5'

const dimensions: Record<DINmension, [number, number]> = {
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
	const dimension = dimensions[format]
	const jsPdf = new JSpdf('landscape', undefined, format)

	// Fit image proportionally onto the page
	const pageWidth = dimension[0]
	const pageHeight = dimension[1]
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
