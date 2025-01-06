import { PolarActionContext } from '@polar/lib-custom-types'
import { LineString, MultiPoint, Polygon } from 'ol/geom'
import { Coordinate } from 'ol/coordinate'
import Style, { StyleFunction } from 'ol/style/Style'
import { Text } from 'ol/style'
import { getArea, getLength } from 'ol/sphere'
import { Projection } from 'ol/proj'
import { MeasureGetters, MeasureState, Mode } from '../../types'
import createStyle from '../../utils/createStyle'

const standardStyle = {
  opacity: 0.8,
  lineWidth: 3,
  pointWidth: 3,
}

const getStyleTypeParameters = (styleType: Mode) =>
  ({
    draw: {
      // lower opacity and slightly larger points
      opacity: 0.5,
      pointWidth: 4,
    },
    edit: {
      // larger points for easier movement
      pointWidth: 5,
    },
    delete: {
      // larger lines and points
      lineWidth: 4,
      pointWidth: 5,
    },
    select: {
      // higher opacity with thicker lines and bigger points
      opacity: 1,
      lineWidth: 5,
      pointWidth: 5,
    },
  }[styleType])

/**
 * Calculates the measurement of the given geometry fixed to two decimal places.
 */
const getRoundedMeasure = (
  geometry: LineString | Polygon,
  unit: 'm' | 'km',
  projection: Projection
) =>
  Math.round(
    (geometry.getType() === 'Polygon'
      ? getArea(geometry, { projection })
      : getLength(geometry, { projection }) / (unit === 'km' ? 1000 : 1)) * 100
  ) / 100

function calculatePartialDistances(
  lineStyle: Style,
  coordinates: Coordinate[],
  unit: 'm' | 'km',
  projection: Projection
) {
  const styles: Style[] = []

  for (let i = 1; i < coordinates.length; i++) {
    const lineString = new LineString([coordinates[i - 1], coordinates[i]])
    const style = lineStyle.clone()
    style.setGeometry(lineString)
    const value = getRoundedMeasure(lineString, unit, projection)
    const text = value + unit
    const textStyle = style.getText()
    if (textStyle === null) {
      style.setText(new Text({ text }))
    } else {
      textStyle.setText(text)
      style.setText(textStyle)
    }
    styles.push(style)
  }

  return styles
}

export default function (
  {
    commit,
    getters,
    rootGetters,
  }: PolarActionContext<MeasureState, MeasureGetters>,
  styleType: Mode | undefined
): StyleFunction {
  const [polygonStyle, lineStyle, pointStyle] = createStyle({
    ...standardStyle,
    ...(styleType ? getStyleTypeParameters(styleType) : {}),
    color: getters.color,
    textColor: getters.textColor,
  })

  return (feature) => {
    const styles = [polygonStyle, pointStyle]
    const geom = feature.getGeometry() as Polygon | LineString
    if (
      !geom ||
      (geom.getType() !== 'LineString' && geom.getType() !== 'Polygon')
    ) {
      return []
    }
    const coordinates =
      geom.getType() === 'Polygon'
        ? (geom as Polygon).getCoordinates()[0]
        : (geom as LineString).getCoordinates()
    // sets points at the corners/coordinates
    const points = new MultiPoint(coordinates)
    const ps = pointStyle.clone()
    ps.setGeometry(points)
    styles.push(ps)
    const projection = rootGetters.map.getView().getProjection()
    styles.push(
      ...calculatePartialDistances(
        lineStyle,
        coordinates,
        getters.unit,
        projection
      )
    )
    // updates the measured value of complete Length/Area, when Line/Polygon is selected
    geom.set('measure', getRoundedMeasure(geom, getters.unit, projection))
    if (feature === getters.selectedFeature) {
      commit('setMeasure')
    }
    return styles
  }
}
