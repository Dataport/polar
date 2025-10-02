import type { Map } from 'ol'
import type { Coordinate } from 'ol/coordinate'
import type { PinBoundary } from '../types'

/**
 * Checks if boundary layer conditions are met; returns false if not and
 * toasts to the user about why the action was blocked, if `toastAction` is
 * configured. If no boundaryLayer configured, always returns true.
 */
export function isCoordinateInBoundaryLayer(
	coordinate: Coordinate,
	map: Map,
	boundary?: PinBoundary
) {
	if (!boundary) {
		return true
	}
	console.warn('coordinate', coordinate, map)
	return true
	// TODO(dopenguin): passesBoundaryCheck is being migrated on vue3/migration-plugin-geo-location. Uncomment afterwards.
	/* const boundaryCheckResult = await passesBoundaryCheck(
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
		notifyUser('error', 'boundaryError', { ns: 'pins' })
		console.error('Checking boundary layer failed.')
	} else {
		notifyUser('info', 'notInBoundary', { ns: 'pins' })
		// eslint-disable-next-line no-console
		console.info('Pin position outside of boundary layer:', coordinate)
	}
	return false */
}
