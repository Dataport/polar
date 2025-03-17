import { PolarActionContext } from '@polar/lib-custom-types'
import Draw from 'ol/interaction/Draw'
import { getSnaps } from '@polar/plugin-draw'
import Snap from 'ol/interaction/Snap'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import { DiplanGetters, DiplanState } from '../../types'

// WIP
// eslint-disable-next-line max-lines-per-function
export const cutPolygons = ({
  commit,
  dispatch,
  rootGetters,
}: PolarActionContext<DiplanState, DiplanGetters>) => {
  dispatch('plugin/draw/setMode', 'none', { root: true })
  commit('setDrawMode', 'cut')

  const drawSource: VectorSource = rootGetters['plugin/draw/drawSource']

  const draw = new Draw({ type: 'LineString' })

  draw.on('drawend', (e) => {
    const cutLine = e.feature
    const features = drawSource.getFeatures()
    const nextFeatures = features.reduce((accumulator, feature) => {
      // TODO cut feature with line if it's a polygon, add multiple features thereafter
      // turf.polygonToLine(poly)
      // cut lines with cutLine, then union with all affected
      // turf.polygonize(unionedLines)
      console.error(cutLine)
      accumulator.push(feature)
      return accumulator
    }, [] as Feature[])
    drawSource.clear()
    drawSource.addFeatures(nextFeatures)

    commit('setDrawMode', null)
  })

  dispatch(
    'plugin/toast/addToast',
    {
      type: 'info',
      text: 'Cut not yet implemented.',
      timeout: 3000,
    },
    { root: true }
  )

  dispatch(
    'plugin/draw/setInteractions',
    [
      draw,
      ...getSnaps(
        rootGetters.map,
        rootGetters.configuration?.draw?.snapTo || []
      ),
      new Snap({ source: drawSource }),
    ],
    { root: true }
  )
}
