import PolygonStyle from '@masterportal/masterportalapi/src/vectorStyle/styles/polygon/stylePolygon'
import { Circle, Fill, Icon, Stroke, Text } from 'ol/style'

// imitate class to match keyMap ...
function Hatch(params) {
	const polygonStyle = new PolygonStyle()
	return polygonStyle.getPolygonFillHatch(params)?.getContext('2d')?.fillStyle
}

// maps keys from source to key that's actually to be written
const inputKeyToOpenLayersKey = (key: string) =>
	({
		imageCircle: 'image',
		imageIcon: 'image',
		hatch: 'color',
	})[key] || key

const inputKeyToOpenLayersClass = {
	fill: Fill,
	stroke: Stroke,
	text: Text,
	imageCircle: Circle,
	imageIcon: Icon,
	hatch: Hatch,
}

/**
 * This function builds the parameter tree to an `ol/Style` instantiation.
 * @param styleFragment - This may be anything (except for actual ol instances) that resides at any nesting level in `ol/Style`'s instantiation parameter, which is named `options` in ol's documentation. @see https://openlayers.org/en/latest/apidoc/module-ol_style_Style-Style.html Please mind that only a finite set of nested classes is currently supported, see above function definition and API.md file.
 */
export const buildStyleParameters = (styleFragment) =>
	typeof styleFragment === 'object' && !Array.isArray(styleFragment)
		? Object.entries(styleFragment).reduce((accumulator, [key, value]) => {
				if (inputKeyToOpenLayersClass[key]) {
					accumulator[inputKeyToOpenLayersKey(key)] =
						new inputKeyToOpenLayersClass[key]({
							...buildStyleParameters(value),
							...(key === 'text' ? { text: '' } : {}),
						})
				} else {
					accumulator[inputKeyToOpenLayersKey(key)] =
						buildStyleParameters(value)
				}
				return accumulator
			}, {})
		: styleFragment
