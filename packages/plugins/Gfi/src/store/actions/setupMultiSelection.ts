import { Map } from 'ol'
import { Modify } from 'ol/interaction'
import Draw, {
  createBox,
  type Options as DrawOptions,
} from 'ol/interaction/Draw'
import { platformModifierKeyOnly } from 'ol/events/condition'
import { Fill, Stroke, Style } from 'ol/style'
import { PolarActionContext } from '@polar/lib-custom-types'
import { GfiGetters, GfiState } from '../../types'

const isDrawing = (map: Map) =>
  map
    .getInteractions()
    .getArray()
    .some(
      (interaction) =>
        // @ts-expect-error | internal hack to detect it from @polar/plugin-draw
        (interaction instanceof Draw && interaction._isDrawPlugin) ||
        interaction instanceof Modify ||
        // @ts-expect-error | internal hack to detect it from @polar/plugin-draw
        interaction._isDeleteSelect ||
        // @ts-expect-error | internal hack to detect it from @polar/plugin-measure
        interaction._isMeasureSelect
    )

const drawOptions: DrawOptions = {
  stopClick: true,
  type: 'Circle',
  style: new Style({
    stroke: new Stroke({ color: 'white', width: 1.5 }),
    fill: new Fill({ color: [255, 255, 255, 0.75] }),
  }),
  freehandCondition: (event) => {
    if (event.type === 'pointermove') {
      return false
    } else if (event.type === 'pointerup') {
      return true
    }
    return platformModifierKeyOnly(event)
  },
  condition: () => false,
}

export function setupMultiSelection({
  dispatch,
  getters: {
    gfiConfiguration: { boxSelect, directSelect, multiSelect },
  },
  rootGetters,
}: PolarActionContext<GfiState, GfiGetters>) {
  if (boxSelect || multiSelect === 'box' || multiSelect === 'circle') {
    if (boxSelect) {
      console.warn(
        '@polar/plugin-gfi: Configuration parameter "boxSelect" has been deprecated. Please use the new parameter "multiSelect" set to "box" instead.'
      )
    }
    if (multiSelect !== 'circle') {
      drawOptions.geometryFunction = createBox()
    } else {
      delete drawOptions.geometryFunction
    }
    const draw = new Draw(drawOptions)
    draw.on('drawstart', () => {
      // @ts-expect-error | internal hack to detect it in @polar/plugin-pins
      draw._isMultiSelect = true
    })
    draw.on('drawend', (e) =>
      dispatch('getFeatureInfo', {
        // @ts-expect-error | A feature that is drawn has a geometry.
        coordinateOrExtent: e.feature.getGeometry().getExtent(),
        modifierPressed: true,
      }).finally(
        () =>
          // @ts-expect-error | internal hack to detect it in @polar/plugin-pins
          (draw._isMultiSelect = false)
      )
    )
    rootGetters.map.addInteraction(draw)
  }
  if (directSelect) {
    rootGetters.map.on('click', ({ coordinate, originalEvent }) => {
      if (!isDrawing(rootGetters.map)) {
        dispatch('getFeatureInfo', {
          coordinateOrExtent: coordinate,
          modifierPressed:
            navigator.userAgent.indexOf('Mac') !== -1
              ? originalEvent.metaKey
              : originalEvent.ctrlKey,
        })
      }
    })
  }
}
