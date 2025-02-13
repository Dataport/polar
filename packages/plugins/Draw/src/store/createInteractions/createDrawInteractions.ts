import { Draw, Snap } from 'ol/interaction'
import Interaction from 'ol/interaction/Interaction'
import { PolarActionContext } from '@polar/lib-custom-types'
import { CreateInteractionsPayload, DrawGetters, DrawState } from '../../types'
import createDrawStyle from '../../utils/createDrawStyle'
import { getSchnaps } from './getSnaps'

export default function (
  {
    dispatch,
    rootGetters,
    getters: {
      configuration,
      drawMode,
      measureMode,
      selectedStrokeColor,
      textInput,
      textSize,
    },
  }: PolarActionContext<DrawState, DrawGetters>,
  { drawSource }: CreateInteractionsPayload
): Promise<Interaction[]> | Interaction[] {
  if (drawMode === 'Text') {
    return dispatch('createTextInteractions', {
      textInput,
      textSize,
      drawSource,
      configuration,
    })
  }
  const style = createDrawStyle(
    drawMode,
    selectedStrokeColor,
    measureMode,
    rootGetters.map.getView().getProjection(),
    configuration?.style
  )
  const draw = new Draw({
    source: drawSource,
    type: drawMode,
    style,
  })
  // @ts-expect-error | internal hack to detect it in @polar/plugin-pins and @polar/plugin-gfi
  draw._isDrawPlugin = true
  draw.on('drawend', (e) => e.feature.setStyle(style))
  return [
    draw,
    ...getSchnaps(
      rootGetters.map,
      rootGetters.configuration?.draw?.snapTo || []
    ),
    new Snap({ source: drawSource }),
  ]
}
