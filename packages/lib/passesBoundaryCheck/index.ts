import { LayerBoundPluginOptions } from '@polar/lib-custom-types'
import { Map } from 'ol'
import { Coordinate } from 'ol/coordinate'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

// arbitrarily give up after 10s of stalling
let readinessChecks = 0
const readinessCheckLimit = 100
const readinessWaitTime = 100

export const errors = {
  undefinedBoundaryLayer: Symbol.for('Boundary Layer undefined'),
  undefinedBoundarySource: Symbol.for('Boundary Source undefined'),
  sourceNotReady: Symbol.for('Source not ready'),
} as const

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
  boundaryLayerId: LayerBoundPluginOptions['boundaryLayerId'],
  coordinate: Coordinate
): Promise<boolean | symbol> => {
  if (typeof boundaryLayerId === 'undefined') {
    return Promise.resolve(true)
  }

  const boundaryLayer = map
    .getLayers()
    .getArray()
    .find((layer) => layer.get('id') === boundaryLayerId) as VectorLayer

  if (!boundaryLayer) {
    console.error(
      `@polar/lib-passes-boundary-check: No layer configured to match boundaryLayerId "${boundaryLayerId}".`
    )
    return Promise.resolve(errors.undefinedBoundaryLayer)
  }

  const boundaryLayerSource = boundaryLayer.getSource()

  if (!boundaryLayerSource) {
    console.error(
      `@polar/lib-passes-boundary-check: Layer with boundaryLayerId "${boundaryLayerId}" missing source.`
    )
    return Promise.resolve(errors.undefinedBoundarySource)
  }

  const sourceReady = await isReady(boundaryLayerSource)

  if (!sourceReady) {
    console.error(
      `@polar/lib-passes-boundary-check: Layer with boundaryLayerId "${boundaryLayerId}" did not load or is featureless.`
    )
    return Promise.resolve(errors.sourceNotReady)
  }

  const features = boundaryLayerSource.getFeatures() || []
  return Promise.resolve(
    features.some((feature) =>
      feature.getGeometry()?.intersectsCoordinate(coordinate)
    )
  )
}
