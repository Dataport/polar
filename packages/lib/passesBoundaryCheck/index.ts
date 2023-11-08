import { Map } from 'ol'
import { Coordinate } from 'ol/coordinate'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

// arbitrarily give up after 10s of stalling
let readinessChecks = 0
const readinessCheckLimit = 100
const readinessWaitTime = 100

/**
 * @param source - source to check
 * @returns Promise that resolves true if source is in 'ready' state with at
 *          least one feature within 10s; false else.
 */
const isReady = async (source: VectorSource): Promise<boolean> => {
  while (source.getState() !== 'ready' || source.getFeatures().length === 0) {
    if (readinessChecks++ < readinessCheckLimit) {
      await new Promise((resolve) => {
        setTimeout(resolve, readinessWaitTime)
      })
    } else {
      return false
    }
  }
  readinessChecks = 0
  return true
}

/**
 * @returns Promise that resolves false if anything about the boundary check
 *          broke.
 */
export const passesBoundaryCheck = async (
  map: Map,
  boundaryLayerId: string | undefined,
  coordinate: Coordinate
): Promise<boolean> => {
  if (typeof boundaryLayerId === 'undefined') {
    return Promise.resolve(true)
  }

  const boundaryLayer = map
    .getLayers()
    .getArray()
    .find(
      (layer) => layer.get('id') === boundaryLayerId
    ) as VectorLayer<VectorSource>

  if (!boundaryLayer) {
    console.error(
      `POLAR Map Client: No layer configured to match boundaryLayerId "${boundaryLayerId}" in plugins/GeoLocation/src/utils/isWithinBoundary.ts.`
    )
    return Promise.resolve(false)
  }

  const boundaryLayerSource = boundaryLayer.getSource()

  if (!boundaryLayerSource) {
    console.error(
      `POLAR Map Client: Layer with boundaryLayerId "${boundaryLayerId}" missing source in plugins/GeoLocation/src/utils/isWithinBoundary.ts.`
    )
    return Promise.resolve(false)
  }

  const sourceReady = await isReady(boundaryLayerSource)

  if (!sourceReady) {
    console.error(
      `POLAR Map Client: Layer with boundaryLayerId "${boundaryLayerId}" did not load or is featureless in plugins/GeoLocation/src/utils/isWithinBoundary.ts.`
    )
    return Promise.resolve(false)
  }

  const features = boundaryLayerSource.getFeatures() || []
  return Promise.resolve(
    features.some((feature) =>
      feature.getGeometry()?.intersectsCoordinate(coordinate)
    )
  )
}
