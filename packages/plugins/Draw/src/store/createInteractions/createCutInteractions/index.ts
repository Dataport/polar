import { PolarActionContext } from '@polar/lib-custom-types'
import Feature from 'ol/Feature'
import {
  Feature as GeoJsonFeature,
  LineString as GeoJsonLineString,
} from 'geojson'
import {
  DrawState,
  DrawGetters,
  CreateInteractionsPayload,
} from '../../../types'
import {
  converter,
  cutCuttablesWithCutter,
  splitByCuttability,
} from './cutlery'
import { makeDraw } from './makeDraw'

// NOTE: Lots of "as" casting in whole module due to conversions' broad returns

const wgs84Epsg = 'EPSG:4326'

export const createCutInteractions = (
  {
    dispatch,
    rootGetters,
    getters,
  }: PolarActionContext<DrawState, DrawGetters>,
  { drawSource }: CreateInteractionsPayload
) => {
  const projectionInfo = {
    featureProjection: rootGetters.map.getView().getProjection().getCode(),
    dataProjection: wgs84Epsg,
  }
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
        console.error(
          `@polar/plugin-draw: Cut operation failed for unknown reason.`
        )
        if (getters.toastAction) {
          dispatch(
            getters.toastAction,
            {
              type: 'error',
              text: 'draw.cut.error.cutFailed',
            },
            { root: true }
          )
        }
      }
    } else if (getters.toastAction) {
      dispatch(
        getters.toastAction,
        {
          type: 'info',
          text: 'draw.cut.warn.unevenCut',
        },
        { root: true }
      )
    }
  })

  return [draw]
}
