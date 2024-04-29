import { PolarActionContext } from '@polar/lib-custom-types'
import { LineString, MultiPoint, Polygon } from 'ol/geom'
import { Coordinate } from 'ol/coordinate'
import Style, { StyleFunction } from 'ol/style/Style'
import { MeasureGetters, MeasureState, Mode } from '../types'
import createStyle from './createStyle'

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

const calculatePartialDistances = (
  lineStyle: Style,
  coordinates: Coordinate[],
  getRoundedMeasure: (geom: LineString) => number,
  unit: string
) => {
  const styles: Style[] = []

  for (let i = 1; i < coordinates.length; i++) {
    const l = new LineString([coordinates[i - 1], coordinates[i]])
    const s = lineStyle.clone()
    s.setGeometry(l)
    const value = getRoundedMeasure(l)
    const text = value + unit
    s.getText().setText(text)
    styles.push(s)
  }

  return styles
}

/**
 * Creates the interactions necessary to delete points or vertices of the drawn features
 * @param context - ActionContext to have access to dispatch, commit and getters
 * @param styleType - Tool-Mode
 * @returns StyleFunc
 */
export default function (
  { commit, getters }: PolarActionContext<MeasureState, MeasureGetters>,
  styleType: Mode | undefined
): StyleFunction {
  const [polygonStyle, lineStyle, pointStyle] = createStyle({
    color: getters.color,
    text: getters.textColor,
    ...standardStyle,
    ...(styleType ? getStyleTypeParameters(styleType) : {}),
  })

  // set corner-points and text
  const styleFunc = (feature) => {
    // setting only polygon and point as standard
    const styles = [polygonStyle, pointStyle]
    const geom = feature.getGeometry() as Polygon | LineString
    if (
      !geom ||
      (geom.getType() !== 'LineString' && geom.getType() !== 'Polygon')
    ) {
      return []
    }
    const coordinates: Coordinate[] =
      geom.getType() === 'Polygon'
        ? (geom as Polygon).getCoordinates()[0]
        : (geom as LineString).getCoordinates()
    // sets points at the corners/coordinates
    const points = new MultiPoint(coordinates)
    const ps = pointStyle.clone()
    ps.setGeometry(points)
    styles.push(ps)
    // takes the parts between two coordinates and calculates the partial distance
    styles.push(
      ...calculatePartialDistances(
        lineStyle,
        coordinates,
        getters.getRoundedMeasure,
        getters.unit
      )
    )
    // updates the measured value of complete Length/Area, when Line/Polygon is selected
    geom.set('measure', getters.getRoundedMeasure(geom))
    if (feature === getters.selectedFeature) {
      commit('setMeasure')
    }
    return styles
  }
  return styleFunc
}
