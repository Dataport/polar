import { jsPDF } from 'jspdf'
import { PolarActionTree } from '@polar/lib-custom-types'
import { ExportFormat, ExportGetters, ExportState } from '../types'

const actions: PolarActionTree<ExportState, ExportGetters> = {
  exportAs(
    { commit, getters: { download }, rootGetters: { map } },
    type: ExportFormat
  ) {
    if (!map) {
      console.warn('@polar/plugin-export: map is not initialized.')
      return
    }

    // PDF options
    const dims = {
      a0: [1189, 841],
      a1: [841, 594],
      a2: [594, 420],
      a3: [420, 297],
      a4: [297, 210],
      a5: [210, 148],
    }

    //  Screenshot canvas
    const CANVAS_ID = 'export-canvas'

    map.once('postrender', function () {
      // Map properties
      const size = map.getSize()
      if (!Array.isArray(size) || size.length !== 2) {
        throw Error('Export: Map has no size.')
      }
      const viewResolution = map.getView().getResolution()
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
          '@polar/plugin-export: map does not of a 2d context, export failed.'
        )
        return
      }
      // For every ol-layer, get matrix and apply on canvas
      Array.prototype.forEach.call(
        document
          .querySelector('[data-app]')
          ?.querySelectorAll('.ol-layer canvas'),
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
          } else console.warn('@polar/plugin-export: canvas width is 0')
        }
      )

      const src = mapCanvas.toDataURL(
        type === ExportFormat.PNG ? 'image/png' : 'image/jpeg'
      )

      commit('setExportedMap', src)

      if (!download) {
        /*
        commit(
          'plugin/toast/addToast',
          {
            message: 'Your image is awesome and stored.',
          },
          { root: true }
        )
        */
      } else if (type === ExportFormat.JPG || type === ExportFormat.PNG) {
        const link = document.createElement('a')
        link.download = 'map.' + (type === ExportFormat.PNG ? 'png' : 'jpeg')
        link.href = src
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // TODO: decide on a format, scale map accordingly
        const format = 'a4'
        const dim = dims[format]
        // Import of jspdf is in mounted.
          const pdf = new jsPDF('landscape', undefined, format) // eslint-disable-line
        pdf.addImage(src, 'JPEG', 0, 0, dim[0], dim[1])
        pdf.save('map.pdf')
        // Reset original map size
        map.setSize(size)
        map.getView().setResolution(viewResolution)
      }
    })
    map.renderSync()
  },
}

export default actions
