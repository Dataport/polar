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

export const convertToPdf = (src: string) => {
	// NOTE: when supporting more formats, scale map accordingly
	const format = 'a4'
	const dim = dims[format] as [number, number]
  const jsPdf = new jsPDF('landscape', undefined, format) // eslint-disable-line
	jsPdf.addImage(src, 'JPEG', 0, 0, dim[0], dim[1])

	return {
		pdfSrc: jsPdf.output('datauristring'),
		jsPdf,
	}
}
