/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import createStyle from '@masterportal/masterportalapi/src/vectorStyle/createStyle'
import Interaction from 'ol/interaction/Interaction'
import { PolarActionContext } from '@polar/lib-custom-types'
import { Draw, Snap } from 'ol/interaction'
// import { Stroke } from 'ol/style'
import { CreateInteractionsPayload, DrawGetters, DrawState } from '../../types'
import { castRgbaToArray } from '../../utils/castColors'
import createDeleteInteractions from './createDeleteInteractions'
import createTextInteractions from './createTextInteractions'

// prevent unhelpful warning from masterportalapi because POLAR does not have a config.js
const originalConsoleWarn = console.warn
console.warn = function (message: string) {
  if (
    typeof message === 'string' &&
    message.includes('wfsImgPath at Config.js is not defined')
  ) {
    return
  }
  originalConsoleWarn.apply(console, [message])
}

export default function (
  {
    dispatch,
    getters: {
      configuration,
      drawMode,
      mode,
      textInput,
      textSize,
      selectedStrokeColor,
    },
  }: PolarActionContext<DrawState, DrawGetters>,
  { drawSource, drawLayer }: CreateInteractionsPayload
): Interaction[] | Promise<Interaction[]> {
  if (mode === 'draw') {
    if (drawMode === 'Text') {
      return createTextInteractions(
        textInput,
        textSize,
        drawSource,
        configuration
      )
    }
    const geomType = `${drawMode.charAt(0).toLowerCase()}${drawMode.slice(1)}`
    const style = configuration ? configuration[`${geomType}Style`] : undefined
    const draw = new Draw({ source: drawSource, type: drawMode })
    if (style) {
      const attributeStrokeColor =
        drawMode === 'LineString'
          ? 'lineStrokeColor'
          : drawMode === 'Polygon'
          ? `${geomType}StrokeColor`
          : 'circleStrokeColor'
      draw.on('drawend', (event) => {
        style[attributeStrokeColor] = castRgbaToArray(selectedStrokeColor)
        const vectorStyle = { rules: [{ style }] }
        event.feature.setStyle(
          createStyle.createStyle(vectorStyle, event.feature)
        )
      })
    }
    return [draw, new Snap({ source: drawSource })]
  } else if (mode === 'edit') {
    return dispatch('createModifyInteractions', { drawSource, drawLayer })
  } else if (mode === 'delete') {
    return createDeleteInteractions(drawSource, drawLayer)
  }
  return []
}
