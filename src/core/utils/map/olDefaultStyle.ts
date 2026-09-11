import { Circle, Fill, Stroke, Style } from 'ol/style.js'

const fill = new Fill({
	color: 'rgba(255,255,255,0.4)',
})
const stroke = new Stroke({
	color: '#3399CC',
	width: 1.25,
})

/**
 * OL default style according to their style documentation:
 * https://openlayers.org/en/latest/apidoc/module-ol_style_Style-Style.html
 */
export const styles = [
	new Style({
		image: new Circle({
			fill,
			stroke,
			radius: 5,
		}),
		fill,
		stroke,
	}),
]
