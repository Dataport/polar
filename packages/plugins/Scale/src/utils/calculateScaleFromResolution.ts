import { METERS_PER_UNIT, type MetersPerUnitLookup } from 'ol/proj/Units'
import beautifyScale from './beautifyScale'
import getDpi from './getDpi'
import thousandsSeparator from './thousandsSeperator'

function calculateScaleFromResolution(
  unit: keyof MetersPerUnitLookup,
  resolution: number
): string {
  // inchesPerMetre is used to convert the resolution (distance in meters) to
  // inches per pixel (1in = 96px) so that it can be multiplied with dpi.
  const inchesPerMetre = 39.37
  const scale = Math.round(
    resolution * METERS_PER_UNIT[unit] * inchesPerMetre * getDpi()
  )
  return thousandsSeparator(beautifyScale(scale))
}

export default calculateScaleFromResolution
