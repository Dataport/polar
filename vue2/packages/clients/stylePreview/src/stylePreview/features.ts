import { Feature } from 'ol'
import { LineString, Point, Polygon } from 'ol/geom'

export const features = {
  point: new Feature({ geometry: new Point([]) }),
  lineString: new Feature({ geometry: new LineString([]) }),
  polygon: new Feature({ geometry: new Polygon([]) }),
  text: new Feature({ geometry: new LineString([]) }),
}
