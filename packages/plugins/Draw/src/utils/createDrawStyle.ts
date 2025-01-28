import { type DrawStyle, type MeasureMode } from '@polar/lib-custom-types'
import centerOfMass from '@turf/center-of-mass'
import { type Color } from 'ol/color'
import { type ColorLike } from 'ol/colorlike'
import { Feature } from 'ol'
import { LineString, Point, Polygon } from 'ol/geom'
import { type Projection } from 'ol/proj'
import { getArea, getLength } from 'ol/sphere'
import { Circle as CircleStyle, Fill, Stroke } from 'ol/style'
import Style, { type Options, StyleFunction } from 'ol/style/Style'
import Text, { type Options as TextOptions } from 'ol/style/Text'

function calculatePartialDistances(
  styles: Style[],
  styleOptions: Options,
  textOptions: TextOptions,
  feature: Feature,
  unit: 'm' | 'km',
  projection: Projection
) {
  const geometry = feature.getGeometry() as LineString | Polygon
  const coordinates =
    geometry instanceof Polygon
      ? geometry.getCoordinates()[0]
      : geometry.getCoordinates()
  for (let i = 1; i < coordinates.length; i++) {
    const lineString = new LineString([coordinates[i - 1], coordinates[i]])
    const text = `${Math.round(
      getLength(lineString, {
        projection,
      }) / (unit === 'km' ? 1000 : 1)
    )} ${unit}`
    feature.set(`length-${i}`, text)
    const style = new Style({
      ...styleOptions,
      text: new Text({
        ...textOptions,
        text,
      }),
    })
    style.setGeometry(lineString)
    styles.push(style)
  }

  return styles
}

function getAreaText(
  geometry: Polygon,
  projection: Projection,
  measureMode: Exclude<MeasureMode, 'none'>
) {
  let areaUnit = ''
  let divisor: number
  if (measureMode === 'metres') {
    areaUnit = 'm²'
    divisor = 1
  } else if (measureMode === 'kilometres') {
    areaUnit = 'km²'
    divisor = 1000
  } else {
    areaUnit = 'ha'
    divisor = 10000
  }
  return `${Math.round(
    getArea(geometry, { projection }) / divisor
  )} ${areaUnit}`
}

const measureStyle: (
  styleOptions: Options,
  measureMode: Exclude<MeasureMode, 'none'>,
  projection: Projection,
  measureStyleOptions?: TextOptions
) => StyleFunction =
  (styleOptions, measureMode, projection, measureStyleOptions) => (feature) => {
    const geometry = feature.getGeometry()
    if (geometry instanceof Polygon || geometry instanceof LineString) {
      const styles = [new Style(styleOptions)]
      const textOptions: TextOptions = {
        font: '16px sans-serif',
        placement: 'line',
        fill: new Fill({ color: 'black' }),
        stroke: new Stroke({ color: 'black' }),
        offsetY: -5,
        ...measureStyleOptions,
      }
      const lengthUnit = measureMode === 'metres' ? 'm' : 'km'
      if (geometry instanceof Polygon) {
        const text = getAreaText(geometry, projection, measureMode)
        const style = new Style({
          text: new Text({
            ...textOptions,
            placement: 'point',
            text,
          }),
        })
        // @ts-expect-error | Features in this StyleFunction are always of type Feature<Geometry>
        feature.set('area', text)
        style.setGeometry(
          new Point(
            centerOfMass({
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: geometry.getCoordinates(),
              },
            }).geometry.coordinates
          )
        )
        styles.push(style)
      }
      return calculatePartialDistances(
        styles,
        styleOptions,
        textOptions,
        feature as Feature,
        lengthUnit,
        projection
      )
    }
    return new Style(styleOptions)
  }

export default function (
  drawMode: string,
  strokeColor: string,
  measureMode: MeasureMode,
  projection: Projection,
  drawStyle?: DrawStyle
): Style | StyleFunction {
  const defaultFillColor = 'rgba(255, 255, 255, 0.5)'
  if (drawMode === 'Point') {
    return createPointStyle(
      strokeColor,
      drawStyle?.circle?.fillColor
        ? drawStyle.circle.fillColor
        : defaultFillColor,
      drawStyle?.circle?.radius
    )
  }
  const fillColor = drawStyle?.fill?.color
    ? drawStyle.fill.color
    : defaultFillColor
  const styleOptions: Options = {
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({
        color: fillColor,
      }),
      stroke: new Stroke({ color: strokeColor }),
    }),
    stroke: new Stroke({
      color: strokeColor,
      width: drawStyle?.stroke?.width || 2,
    }),
    fill: new Fill({
      color: fillColor,
    }),
  }
  return measureMode === 'none'
    ? new Style(styleOptions)
    : measureStyle(styleOptions, measureMode, projection, drawStyle?.measure)
}

function createPointStyle(
  strokeColor: string,
  fillColor: Color | ColorLike,
  radius = 5
) {
  return new Style({
    image: new CircleStyle({
      radius,
      fill: new Fill({
        color: fillColor,
      }),
      stroke: new Stroke({ color: strokeColor }),
    }),
  })
}
