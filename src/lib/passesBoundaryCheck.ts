import type { Map } from 'ol'
import type { Coordinate } from 'ol/coordinate'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'

export const errors = {
	undefinedBoundaryLayer: Symbol.for('Boundary Layer undefined'),
	undefinedBoundarySource: Symbol.for('Boundary Source undefined'),
	sourceNotReady: Symbol.for('Source not ready'),
} as const

// arbitrarily give up after 10s of stalling (100 * 100ms)
const readinessCheckLimit = 100
const readinessWaitTime = 100

/**
 * @param source - source to check for readiness
 * @returns Promise that resolves true if source is in 'ready' state with at
 * least one feature within time limit; else resolves false.
 */
const isReady = async (source: VectorSource): Promise<boolean> => {
	let readinessChecks = 0

	while (source.getState() !== 'ready' || source.getFeatures().length === 0) {
		if (readinessChecks++ < readinessCheckLimit) {
			await new Promise((resolve) => {
				setTimeout(resolve, readinessWaitTime)
			})
		} else {
			return false
		}
	}

	return true
}

/**
 * @returns Resolves true if coordinate is within boundary, false if outside of
 * boundary, and an error symbol if something about the check broke. If no
 * boundaryLayerId is set, it always resolves true, think "no boundary exists".
 */
export const passesBoundaryCheck = async (
	map: Map,
	boundaryLayerId: string | undefined,
	coordinate: Coordinate
): Promise<boolean | symbol> => {
	if (typeof boundaryLayerId === 'undefined') {
		return Promise.resolve(true)
	}

	const boundaryLayer = map
		.getLayers()
		.getArray()
		.find((layer) => layer.get('id') === boundaryLayerId)

	if (!(boundaryLayer instanceof VectorLayer)) {
		console.error(
			`@polar/polar/lib/passesBoundaryCheck: No layer configured to match boundaryLayerId "${boundaryLayerId}".`
		)
		return Promise.resolve(errors.undefinedBoundaryLayer)
	}

	const boundaryLayerSource = boundaryLayer.getSource()

	if (!(boundaryLayerSource instanceof VectorSource)) {
		console.error(
			`@polar/polar/lib/passesBoundaryCheck: Layer with boundaryLayerId "${boundaryLayerId}" missing source.`
		)
		return Promise.resolve(errors.undefinedBoundarySource)
	}

	const sourceReady = await isReady(boundaryLayerSource)

	if (!sourceReady) {
		console.error(
			`@polar/polar/lib/passesBoundaryCheck: Layer with boundaryLayerId "${boundaryLayerId}" did not load or is featureless.`
		)
		return Promise.resolve(errors.sourceNotReady)
	}

	const features = boundaryLayerSource.getFeatures()
	return Promise.resolve(
		features.some((feature) =>
			feature.getGeometry()?.intersectsCoordinate(coordinate)
		)
	)
}
