/**
 * This file contains the logic to select the svgConfigs
 * it will be used in the marker.ts file to create the marker icons
 * for the map.
 */

import type { GetSVGConfigFunction } from '../../types'

import { circlePin, circlePinStacked } from './circlePin'
import {
	fiveDigitsPin,
	fourDigitsPin,
	threeDigitsPin,
	twoDigitsPin,
} from './pillPin'

/**
 * This function returns the correct svgConfig based on the number of digits in the clusterCount.
 * @param digits - expects a number to decide which config should be used
 * @returns - the correct svgConfig for the marker.
 */
export const getSVGConfig: GetSVGConfigFunction = (
	digits: number,
	displayFeatureCount: boolean
) => {
	let pinChoice: number

	if (displayFeatureCount) {
		pinChoice = digits < 2 ? 0 : String(digits).length
	} else {
		pinChoice = digits < 2 ? 0 : 1
	}

	switch (pinChoice) {
		case 0:
			return circlePin
		case 1:
			return circlePinStacked
		case 2:
			return twoDigitsPin
		case 3:
			return threeDigitsPin
		case 4:
			return fourDigitsPin
		case 5:
			return fiveDigitsPin
		default:
			throw new Error('Unsupported number of digits')
	}
}
