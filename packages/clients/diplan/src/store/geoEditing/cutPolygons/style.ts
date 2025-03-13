import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import Circle from 'ol/style/Circle'

const colors = {
  fill: '#ecf4ff',
  circleStroke: '#2b3980',
  strokeIneffective: '#dc3545',
  strokeEffective: '#00a645',
}
const width = 5

export const fill = new Fill({
  color: colors.fill,
})

export const circleStroke = new Stroke({
  color: colors.circleStroke,
  width: width * 0.66,
})

export const dashStroke = new Stroke({
  color: colors.strokeIneffective,
  lineDash: [10, 15],
  lineCap: 'square',
  width,
})

export const cutStyle = new Style({
  image: new Circle({
    fill,
    stroke: circleStroke,
    radius: width * 1.33,
  }),
  fill,
  stroke: dashStroke,
})

export const styleCut = (effective: boolean) =>
  dashStroke.setColor(
    effective ? colors.strokeEffective : colors.strokeIneffective
  )
