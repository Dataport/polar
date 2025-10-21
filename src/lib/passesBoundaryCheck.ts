import type { Feature, Map } from 'ol'
import type { Coordinate } from 'ol/coordinate'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

// arbitrarily give up after 10s of stalling (100 * 100ms)
const readinessCheckLimit = 100
const readinessWaitTime = 100

export const errors = {
	undefinedBoundaryLayer: Symbol.for('Boundary Layer undefined'),
	undefinedBoundarySource: Symbol.for('Boundary Source undefined'),
	sourceNotReady: Symbol.for('Source not ready'),
} as const

/**
 * @param source - source to check for readiness
 * @returns Promise that resolves true if source is in 'ready' state with at
 * least one feature within time limit; else resolves false.
 */
async function isReady(source: VectorSource) {
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
 * Checks whether the given coordinate is withing the boundary of the layer that
 * has the given layer id.
 *
 * @returns Resolves true if coordinate is within boundary, false if outside of
 * boundary, and an error symbol if something about the check broke. If no
 * boundaryLayerId is set, it always resolves true, as in "no boundary exists".
 */
export async function passesBoundaryCheck(
	map: Map,
	boundaryLayerId: string | undefined,
	coordinate: Coordinate
) {
	if (typeof boundaryLayerId === 'undefined') {
		return true
	}

	const boundaryLayer = map
		.getLayers()
		.getArray()
		.find((layer) => layer.get('id') === boundaryLayerId)

	if (!(boundaryLayer instanceof VectorLayer)) {
		console.error(
			`No layer configured to match boundaryLayerId "${boundaryLayerId}".`
		)
		return errors.undefinedBoundaryLayer
	}

	const boundaryLayerSource = boundaryLayer.getSource()

	if (!(boundaryLayerSource instanceof VectorSource)) {
		console.error(
			`Layer with boundaryLayerId "${boundaryLayerId}" missing source.`
		)
		return errors.undefinedBoundarySource
	}

	const sourceReady = await isReady(boundaryLayerSource)

	if (!sourceReady) {
		console.error(
			`Layer with boundaryLayerId "${boundaryLayerId}" did not load or is featureless.`
		)
		return errors.sourceNotReady
	}

	const features = boundaryLayerSource.getFeatures() as Feature[]
	return features.some((feature) =>
		feature.getGeometry()?.intersectsCoordinate(coordinate)
	)
}
