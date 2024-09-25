import createStyle from '@masterportal/masterportalapi/src/vectorStyle/createStyle'
import Interaction from 'ol/interaction/Interaction'
import { PolarActionContext } from '@polar/lib-custom-types'
import { Draw, Snap } from 'ol/interaction'
import { CreateInteractionsPayload, DrawGetters, DrawState } from '../../types'
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
    const style = configuration
      ? configuration[
          `${drawMode.charAt(0).toLowerCase()}${drawMode.slice(1)}Style`
        ]
      : undefined
    // TODO const style = createDrawStyle(
    //   drawMode,
    //   selectedStrokeColor,
    //   configuration?.style
    // )
    const draw = new Draw({ source: drawSource, type: drawMode })
    const vectorStyle = { rules: [{ style }] }
    if (style) {
      draw.on('drawend', (event) => {
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
