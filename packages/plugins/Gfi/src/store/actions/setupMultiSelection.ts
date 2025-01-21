import { Map } from 'ol'
import { DragBox, Draw, Modify } from 'ol/interaction'
import { platformModifierKeyOnly } from 'ol/events/condition'
import VectorSource from 'ol/source/Vector'
import { Fill, Stroke, Style } from 'ol/style'
import { PolarActionContext } from '@polar/lib-custom-types'
import { GfiGetters, GfiState } from '../../types'

const circleDraw = new Draw({
  source: new VectorSource(),
  stopClick: true,
  type: 'Circle',
  style: new Style({
    stroke: new Stroke({ color: 'white', width: 1.5 }),
    fill: new Fill({ color: [255, 255, 255, 0.75] }),
  }),
  condition: platformModifierKeyOnly,
})
const dragBox = new DragBox({ condition: platformModifierKeyOnly })

const isDrawing = (map: Map) =>
  map
    .getInteractions()
    .getArray()
    .some(
      (interaction) =>
        // @ts-expect-error | internal hack to detect it from @polar/plugin-gfi
        (interaction instanceof Draw && interaction._isMultiSelect) ||
        interaction instanceof Modify ||
        // @ts-expect-error | internal hack to detect it from @polar/plugin-draw
        interaction._isDeleteSelect ||
        // @ts-expect-error | internal hack to detect it from @polar/plugin-measure
        interaction._isMeasureSelect
    )

// Can be removed once boxSelect is no longer in use
// eslint-disable-next-line max-lines-per-function
export function setupMultiSelection({
  dispatch,
  getters: {
    gfiConfiguration: { boxSelect, directSelect, multiSelect },
  },
  rootGetters: { map },
}: PolarActionContext<GfiState, GfiGetters>) {
  if (boxSelect || multiSelect === 'box') {
    if (boxSelect) {
      console.warn(
        '@polar/plugin-gfi: Configuration parameter "boxSelect" has been deprecated. Please use the new parameter "multiSelect" set to "box" instead.'
      )
    }
    dragBox.on('boxend', () =>
      dispatch('getFeatureInfo', {
        coordinateOrExtent: dragBox.getGeometry().getExtent(),
        modifierPressed: true,
      })
    )
    map.addInteraction(dragBox)
  } else if (multiSelect === 'circle') {
    circleDraw.on('drawstart', () => {
      // @ts-expect-error | internal hack to detect it in @polar/plugin-pins
      circleDraw._isMultiSelect = true
    })
    circleDraw.on('drawend', (e) =>
      dispatch('getFeatureInfo', {
        // @ts-expect-error | A feature that is drawn has a geometry.
        coordinateOrExtent: e.feature.getGeometry().getExtent(),
        modifierPressed: true,
      }).finally(
        () =>
          // @ts-expect-error | internal hack to detect it in @polar/plugin-pins
          (circleDraw._isMultiSelect = false)
      )
    )
    map.addInteraction(circleDraw)
  }

  if (directSelect) {
    map.on('click', ({ coordinate, originalEvent }) => {
      if (!isDrawing(map)) {
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
