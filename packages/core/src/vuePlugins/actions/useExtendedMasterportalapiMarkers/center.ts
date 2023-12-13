import { Feature, Map } from 'ol'
import { Point } from 'ol/geom'
import { easeOut } from 'ol/easing'

export const center = (map: Map, selected: Feature | null) => {
  if (selected !== null) {
    map.getView().animate({
      center: (selected.getGeometry() as Point).getCoordinates(),
      duration: 400,
      easing: easeOut,
    })
  }
}
