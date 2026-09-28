import type { FeatureLike } from 'ol/Feature'

import Circle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import RegularShape from 'ol/style/RegularShape'
import Stroke from 'ol/style/Stroke'
import Style from 'ol/style/Style'

/*
 * TODO: The colors here should stem from KERN e.g. received by:
 * getComputedStyle(
 * 	(
 * 		(document.querySelector('polar-map') as HTMLDivElement)
 * 			.shadowRoot as ShadowRoot
 * 	).firstChild as HTMLStyleElement
 * ).getPropertyValue('--kern-color-action-default')
 */

function createLinearGradient(radians: number, radius: number) {
	const sideLength = (radius / 2) * Math.sqrt(3)

	const gradient = (
		document
			.createElement('canvas')
			.getContext('2d') as CanvasRenderingContext2D
	).createLinearGradient(
		0,
		-sideLength,
		Math.sin(radians),
		sideLength + Math.cos(radians)
	)
	gradient.addColorStop(0, '#0794FAFF') // '#0794FA' polar-blue/400
	gradient.addColorStop(2 / 3, '#0794FA00')

	return gradient
}

function dropDirectionalShadow(feature: FeatureLike) {
	if (typeof feature.get('heading') === 'undefined') {
		return new Style()
	}

	const radius = 42
	const heading = Math.PI - feature.get('heading')

	return new Style({
		image: new RegularShape({
			points: 3,
			radius,
			rotation: heading,
			fill: new Fill({ color: createLinearGradient(heading, radius) }),
			displacement: [0, -(radius - 12)],
		}),
	})
}

export function getGeoLocationStyle() {
	const fill = new Fill({
		color: '#0078D4', // polar-blue/500
	})
	const stroke = new Stroke({
		color: '#FFFFFF',
		width: 2,
	})

	return (feature: FeatureLike) => [
		dropDirectionalShadow(feature),
		new Style({
			image: new Circle({
				fill,
				stroke,
				radius: 12,
			}),
			fill,
			stroke,
		}),
	]
}
