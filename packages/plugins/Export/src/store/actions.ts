import { PolarActionTree } from '@polar/lib-custom-types'
import { jsPDF } from 'jspdf'
import { ExportFormat, ExportGetters, ExportState } from '../types'

// PDF options
const dims = {
  a0: [1189, 841],
  a1: [841, 594],
  a2: [594, 420],
  a3: [420, 297],
  a4: [297, 210],
  a5: [210, 148],
}

// Screenshot canvas
const CANVAS_ID = 'export-canvas'

const convertToPdf = (src: string) => {
  // NOTE: when supporting more formats, scale map accordingly
  const format = 'a4'
  const dim = dims[format]
  // Import of jspdf is in mounted.
  const jsPdf = new jsPDF('landscape', undefined, format) // eslint-disable-line
  jsPdf.addImage(src, 'JPEG', 0, 0, dim[0], dim[1])

  return {
    pdfSrc: jsPdf.output('datauristring'),
    jsPdf,
  }
}

const downloadAsImage = (src: string, type: ExportFormat) => {
  const link = document.createElement('a')
  link.download = 'map.' + (type === ExportFormat.PNG ? 'png' : 'jpeg')
  link.href = src
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// For every ol-layer, get matrix and apply on canvas
const getDataUrl = (size: number[], type: ExportFormat) => {
  // The canvas to render the screenshot in
  const mapCanvas: HTMLCanvasElement = document.createElement('canvas')
  mapCanvas.id = CANVAS_ID
  // mapCanvas.setAttribute('crossOrigin', 'anonymous')
  mapCanvas.width = size[0]
  mapCanvas.height = size[1]

  // Write on this
  const mapContext = mapCanvas.getContext('2d')
  if (!mapContext) {
    console.error(
      '@polar/plugin-export: map does not have a 2d context, export failed.'
    )
    return
  }

  Array.prototype.forEach.call(
    document.querySelector('[data-app]')?.querySelectorAll('.ol-layer canvas'),
    function (canvas) {
      if (canvas.width > 0) {
        const opacity = canvas.parentNode.style.opacity
        mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity)
        const transform = canvas.style.transform
        // Get the transform parameters from the style's transform matrix
        const matrix = transform
          .match(/^matrix\(([^(]*)\)$/)[1]
          .split(',')
          .map(Number)
        // Apply the transform to the export map context
        CanvasRenderingContext2D.prototype.setTransform.apply(
          mapContext,
          matrix
        )
        mapContext.drawImage(canvas, 0, 0)
      } else console.warn('@polar/plugin-export: canvas width is 0.')
    }
  )

  return mapCanvas.toDataURL(
    type === ExportFormat.PNG ? 'image/png' : 'image/jpeg'
  )
}

const actions: PolarActionTree<ExportState, ExportGetters> = {
  exportAs(
    { commit, getters: { download }, rootGetters: { map } },
    type: ExportFormat
  ) {
    if (!map) {
      console.warn('@polar/plugin-export: map is not initialized.')
      return
    }

    map.getInteractions().forEach((interaction) => interaction.setActive(false))

    map.once('postrender', function () {
      const size = map.getSize()
      if (!Array.isArray(size) || size.length !== 2) {
        throw Error('Export: Map has no size.')
      }
      let src = getDataUrl(size, type)
      if (!src) return

      if (type === ExportFormat.JPG || type === ExportFormat.PNG) {
        if (download) downloadAsImage(src, type)
      } else {
        const { pdfSrc, jsPdf } = convertToPdf(src)
        src = pdfSrc

        if (download) jsPdf.save('map.pdf')
      }

      map.getInteractions().forEach((interaction) => {
        interaction.setActive(true)
      })

      commit('setExportedMap', src)
    })

    map.renderSync()
  },
}

export default actions
