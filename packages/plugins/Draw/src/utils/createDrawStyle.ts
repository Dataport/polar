import { type DrawStyle } from '@polar/lib-custom-types'
import centerOfMass from '@turf/center-of-mass'
import { Circle as CircleStyle, Fill, Stroke } from 'ol/style'
import Style, { type Options, StyleFunction } from 'ol/style/Style'
import Text, { type Options as TextOptions } from 'ol/style/Text'
import { type Color } from 'ol/color'
import { type ColorLike } from 'ol/colorlike'
import { LineString, Point, Polygon } from 'ol/geom'
import { getArea, getLength } from 'ol/sphere'
import { type Projection } from 'ol/proj'
import { Coordinate } from 'ol/coordinate'
import { type MeasureMode } from '../types'

function calculatePartialDistances(
  styles: Style[],
  styleOptions: Options,
  textOptions: TextOptions,
  coordinates: Coordinate[],
  unit: 'm' | 'km',
  projection: Projection
) {
  for (let i = 1; i < coordinates.length; i++) {
    const lineString = new LineString([coordinates[i - 1], coordinates[i]])
    const style = new Style({
      ...styleOptions,
      text: new Text({
        ...textOptions,
        text: `${Math.round(
          getLength(lineString, {
            projection,
          }) / (unit === 'km' ? 1000 : 1)
        )} ${unit}`,
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
  let factor: number
  if (measureMode === 'metres') {
    areaUnit = 'm²'
    factor = 1
  } else if (measureMode === 'kilometres') {
    areaUnit = 'km²'
    factor = 1000
  } else {
    areaUnit = 'ha'
    factor = 10000
  }
  return `${Math.round(getArea(geometry, { projection }) / factor)} ${areaUnit}`
}

const measureStyle: (
  styleOptions: Options,
  measureMode: Exclude<MeasureMode, 'none'>,
  projection: Projection
) => StyleFunction = (styleOptions, measureMode, projection) => (feature) => {
  const geometry = feature.getGeometry()
  if (geometry instanceof Polygon || geometry instanceof LineString) {
    const styles = [new Style(styleOptions)]
    const textOptions: TextOptions = {
      font: '16px sans-serif',
      placement: 'line',
      fill: new Fill({ color: 'black' }),
      stroke: new Stroke({ color: 'black' }),
      offsetY: -5,
    }
    const lengthUnit = measureMode === 'metres' ? 'm' : 'km'
    if (geometry instanceof Polygon) {
      const style = new Style({
        text: new Text({
          ...textOptions,
          placement: 'point',
          text: getAreaText(geometry, projection, measureMode),
        }),
      })
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
      geometry instanceof Polygon
        ? geometry.getCoordinates()[0]
        : geometry.getCoordinates(),
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
    : measureStyle(styleOptions, measureMode, projection)
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
