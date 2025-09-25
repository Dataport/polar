import { platformModifierKeyOnly } from 'ol/events/condition'
import {
  DragPan,
  KeyboardPan,
  KeyboardZoom,
  MouseWheelZoom,
} from 'ol/interaction'
import type { MapBrowserEvent } from 'ol'

/**
 * Desktop:
 * - LeftHold: Pan
 * - CTRL + Mousewheel: Zoom
 * - Mousewheel: Scroll page
 *
 * Mobile:
 * - 1 finger: Scroll page
 * - 2 fingers: Zoom/Pan
 *
 * @param hasWindowSize - Whether the client is being rendered in the same size as the window.
 * @param hasSmallScreen - Whether the user utilizes a device with a small screen.
 */
export function createPanAndZoomInteractions(
  hasWindowSize: boolean,
  hasSmallScreen: boolean
) {
  if (hasWindowSize) {
    return [new DragPan(), new MouseWheelZoom()]
  }
  return [
    new DragPan({
      condition: function () {
        // @ts-expect-error | As the DragPan is added to the interactions of the map, the 'this' context of the condition function should always be defined.
        return hasSmallScreen ? this.getPointerCount() > 1 : true
      },
    }),
    new MouseWheelZoom({
      condition: platformModifierKeyOnly,
    }),
  ]
}

/**
 * Modified version of `ol/events/condition.js#targetNotEditable` that is able
 * to correctly detect editable elements inside a ShadowDOM, as needed in this
 * situation.
 */
function targetNotEditable(mapBrowserEvent: MapBrowserEvent<KeyboardEvent>) {
  const target = mapBrowserEvent.originalEvent.composedPath()[0] as HTMLElement
  const tagName = target.tagName
  return (
    tagName !== 'INPUT' &&
    tagName !== 'SELECT' &&
    tagName !== 'TEXTAREA' &&
    !target.isContentEditable
  )
}

export const createKeyboardInteractions = () => [
  new KeyboardPan({ condition: targetNotEditable }),
  new KeyboardZoom({ condition: targetNotEditable }),
]
