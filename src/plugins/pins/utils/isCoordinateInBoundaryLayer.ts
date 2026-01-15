import type { Map } from 'ol'
import type { Coordinate } from 'ol/coordinate'

import { t } from 'i18next'

import type { BoundaryOptions } from '@/core'

import { notifyUser } from '@/lib/notifyUser'
import { passesBoundaryCheck } from '@/lib/passesBoundaryCheck'

/**
 * Checks if boundary layer conditions are met; returns false if not and
 * toasts to the user about why the action was blocked, if `toastAction` is
 * configured. If no boundaryLayer configured, always returns true.
 */
export async function isCoordinateInBoundaryLayer(
	coordinate: Coordinate,
	map: Map,
	boundary?: BoundaryOptions
) {
	if (!boundary) {
		return true
	}
	const boundaryCheckResult = await passesBoundaryCheck(
		map,
		boundary.layerId,
		coordinate
	)
	if (
		boundaryCheckResult === true ||
		// If a setup error occurred, client will act as if no boundary was specified.
		(typeof boundaryCheckResult === 'symbol' && boundary.onError !== 'strict')
	) {
		return true
	}

	if (typeof boundaryCheckResult === 'symbol') {
		notifyUser('error', () => t(($) => $.boundaryError, { ns: 'pins' }))
		console.error('Checking boundary layer failed.')
	} else {
		notifyUser('info', () => t(($) => $.notInBoundary, { ns: 'pins' }))
		// eslint-disable-next-line no-console
		console.info('Pin position outside of boundary layer:', coordinate)
	}
	return false
}
