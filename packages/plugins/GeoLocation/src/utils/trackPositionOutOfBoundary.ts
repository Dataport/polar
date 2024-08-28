import { passesBoundaryCheck } from '@polar/lib-passes-boundary-check'
import { containsCoordinate } from 'ol/extent'

export default async function trackPositionOutOfBoundary(
  configuration,
  coords: number[],
  boundaryLayerId: string | undefined,
  map
): Promise<boolean> {
  const coordinateInExtent = containsCoordinate(
    configuration?.extent || [510000.0, 5850000.0, 625000.4, 6000000.0],
    coords
  )
  const boundaryCheckPassed =
    typeof boundaryLayerId === 'string'
      ? await passesBoundaryCheck(map, boundaryLayerId, coords)
      : coordinateInExtent
  const boundaryErrorOccurred = typeof boundaryCheckPassed === 'string'
  return coordinateInExtent && !boundaryCheckPassed && !boundaryErrorOccurred
}
