import { beautifyScale, getDpi, thousandsSeparator } from '@polar/plugin-scale'
import * as olProj from 'ol/proj'

export function calculateScaleFromResolution(
  unit: string,
  resolution: number
): string {
  const inchesPerMetre = 39.37
  const scale = Math.round(
    resolution * olProj.METERS_PER_UNIT[unit] * inchesPerMetre * getDpi()
  )
  return thousandsSeparator(beautifyScale(scale))
}
