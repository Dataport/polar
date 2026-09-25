import type { Feature } from 'ol'
import type { Coordinate } from 'ol/coordinate'
import type { Projection } from 'ol/proj'
import type { StyleFunction } from 'ol/style/Style'
import type { Options as TextOptions } from 'ol/style/Text'
import type { MeasureMode } from '../types'

import { centerOfMass } from '@turf/turf'
import { LineString, Point, Polygon } from 'ol/geom'
import { getArea, getLength } from 'ol/sphere'
import { Fill, Stroke } from 'ol/style'
import Style, { createDefaultStyle } from 'ol/style/Style'
import Text from 'ol/style/Text'

const roundMeasurement = (measurement: number, divisor: number) =>
	Math.round((measurement * 100) / divisor + Number.EPSILON) / 100

function calculatePartialDistances(
	styles: Style[],
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

	if (!coordinates) {
		return styles
	}

	let previous: Coordinate | undefined
	coordinates.forEach((current, i) => {
		if (previous === undefined) {
			previous = current
			return
		}
		const lineString = new LineString([previous, current])
		const lengthInMetres = getLength(lineString, {
			projection,
		})
		const length = roundMeasurement(lengthInMetres, unit === 'km' ? 1000 : 1)
		const text = `${length} ${unit}`
		feature.set(`length-${i}`, roundMeasurement(lengthInMetres, 1))
		const style = new Style({
			text: new Text({
				...textOptions,
				text,
			}),
		})
		style.setGeometry(lineString)
		styles.push(style)
		previous = current
	})
	// This only happens once the drawing has been finished
	if (
		Object.keys(feature.getProperties()).filter((key) =>
			key.startsWith('length-')
		).length === coordinates.length
	) {
		feature.unset(`length-${coordinates.length}`)
	}

	return styles
}

function getAreaUnitAndDivisor(measureMode: Exclude<MeasureMode, 'none'>) {
	let areaUnit: string
	let divisor: number
	if (measureMode === 'metres') {
		areaUnit = 'm²'
		divisor = 1
	} else if (measureMode === 'kilometres') {
		areaUnit = 'km²'
		divisor = 1000000
	} else {
		areaUnit = 'ha'
		divisor = 10000
	}
	return { areaUnit, divisor }
}

export function createMeasureStyle(
	measureMode: Exclude<MeasureMode, 'none'>,
	projection: Projection,
	baseStyle?: Style,
	measureStyleOptions?: TextOptions
): StyleFunction {
	return (feature, resolution) => {
		const geometry = feature.getGeometry()
		// Style for the point from the interaction at the cursor
		if (!(geometry instanceof Polygon || geometry instanceof LineString)) {
			return baseStyle ?? createDefaultStyle(feature, resolution)
		}
		const styles: Style[] = baseStyle
			? [baseStyle]
			: [...createDefaultStyle(feature, resolution)]
		const textOptions: TextOptions = {
			font: '16px sans-serif',
			placement: 'line',
			fill: new Fill({ color: 'black' }),
			stroke: new Stroke({ color: 'black' }),
			offsetY: -5,
			...measureStyleOptions,
		}
		if (geometry instanceof Polygon) {
			const { areaUnit, divisor } = getAreaUnitAndDivisor(measureMode)
			const areaInMetres = getArea(geometry, { projection })
			const area = roundMeasurement(areaInMetres, divisor)
			const text = `${area} ${areaUnit}`
			const style = new Style({
				text: new Text({
					...textOptions,
					placement: 'point',
					text,
				}),
			})
			// @ts-expect-error | Features in this StyleFunction are always of type Feature<Geometry>
			feature.set('area', roundMeasurement(areaInMetres, 1))
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
			textOptions,
			feature as Feature,
			measureMode === 'metres' ? 'm' : 'km',
			projection
		)
	}
}
