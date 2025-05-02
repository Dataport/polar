import { METERS_PER_UNIT, type MetersPerUnitLookup } from 'ol/proj/Units'
import getDpi from './getDpi'

function calculateScaleFromResolution(
  unit: keyof MetersPerUnitLookup,
  resolution: number
): number {
  // inchesPerMetre is used to convert the resolution (distance in meters) to
  // inches per pixel (1in = 96px) so that it can be multiplied with dpi.
  const inchesPerMetre = 39.37
  const scale = Math.round(
    resolution * METERS_PER_UNIT[unit] * inchesPerMetre * getDpi()
  )
  return scale
}

export default calculateScaleFromResolution
