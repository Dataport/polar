import { PolarActionContext } from '@polar/lib-custom-types'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import {
  Feature as GeoJsonFeature,
  LineString as GeoJsonLineString,
} from 'geojson'
import { DiplanGetters, DiplanState } from '../../../types'
import {
  converter,
  cutCuttablesWithCutter,
  splitByCuttability,
} from './cutlery'
import { makeDraw } from './makeDraw'

// NOTE: Lots of "as" casting in whole module due to conversions' broad returns

const wgs84Epsg = 'EPSG:4326'

// length stems from toast dispatchments
// eslint-disable-next-line max-lines-per-function
export const cutPolygons = ({
  dispatch,
  rootGetters,
}: PolarActionContext<DiplanState, DiplanGetters>) => {
  dispatch('updateDrawMode', 'cut')

  const projectionInfo = {
    featureProjection: rootGetters.map.getView().getProjection().getCode(),
    dataProjection: wgs84Epsg,
  }
  const drawSource: VectorSource = rootGetters['plugin/draw/drawSource']
  const draw = makeDraw(projectionInfo, drawSource)
  draw.on('drawend', (e) => {
    const cutter = converter.writeFeatureObject(
      e.feature,
      projectionInfo
    ) as GeoJsonFeature<GeoJsonLineString>
    const [cuttables, uncuttables] = splitByCuttability(
      drawSource,
      cutter,
      projectionInfo
    )

    if (cuttables.length) {
      try {
        const cuts = cutCuttablesWithCutter(cuttables, cutter).map(
          (cut) => converter.readFeature(cut, projectionInfo) as Feature
        )
        drawSource.clear()
        drawSource.addFeatures([...uncuttables, ...cuts])
      } catch {
        dispatch(
          'plugin/toast/addToast',
          {
            type: 'error',
            text: 'diplan.error.cutFailed',
          },
          { root: true }
        )
      }
    } else {
      dispatch(
        'plugin/toast/addToast',
        {
          type: 'info',
          text: 'diplan.warn.unevenCut',
        },
        { root: true }
      )
    }
    dispatch('updateDrawMode', null)
  })

  dispatch('plugin/draw/setInteractions', [draw], { root: true })
}
