import type { Feature } from 'ol'
import { Circle, Fill, RegularShape, Stroke, Style } from 'ol/style.js'

/**
 * All those years of academy training ... finally put to good use.
 * @internal
 */
function createLinearGradient(radians: number, radius: number) {
	const sideLength = (radius / 2) * Math.sqrt(3)

	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')
	// It was revealed to me in a dream.
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const gradient = context!.createLinearGradient(
		0,
		-sideLength,
		Math.sin(radians),
		sideLength + Math.cos(radians)
	)
	gradient.addColorStop(0, '#0794FAFF') // '#0794FA' polar-blue/400
	gradient.addColorStop(2 / 3, '#0794FA00')

	return gradient
}

/*
	// I tried so hard and got so far
	// But in the end, it didn't stop to jitter
	const sizes = Array.from({ length: 17 }, (_, i) => 9 + i * 0.0625)
	sizes.push(...[...sizes].reverse())
	let pointer = 0

	setInterval(() => {
		const inner = sizes[pointer++] ?? 0
		image.setRadius(inner)
		stroke.setWidth(fullRadius - inner)
		layer.setStyle(style)
		if (pointer >= sizes.length) {
			pointer = 0
		}
	}, 100)
	// when retrying, you also need to rerender somehow (e.g. re-setting feature style)
	*/

export const getGeoLocationStyle = () => {
	const strokeWidth = 2
	const circleRadius = 8

	const fill = new Fill({
		color: '#0078D4', // polar-blue/500 – TODO: take from uhhh style system?
	})
	const stroke = new Stroke({
		color: '#FFFFFF',
		width: strokeWidth,
	})
	const image = new Circle({
		fill,
		stroke,
		radius: circleRadius,
	})
	const style = new Style({
		image,
		fill,
		stroke,
	})

	const dropDirectionalShadow = (feature: Feature, radius = 42) => {
		if (typeof feature.get('heading') === 'undefined') {
			return new Style()
		}

		const heading = Math.PI - feature.get('heading')

		return new Style({
			// it would be so cool if i had a trapezoid and not just a triangle
			image: new RegularShape({
				points: 3,
				radius,
				rotation: heading,
				fill: new Fill({ color: createLinearGradient(heading, radius) }),
				displacement: [0, -(radius - circleRadius)],
			}),
		})
	}

	return (feature) => [dropDirectionalShadow(feature), style]
}
