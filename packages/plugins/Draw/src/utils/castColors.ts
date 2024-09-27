import { RgbaObject } from '../types'

export function castArrayToRgba(rgbaArray: number[]): RgbaObject {
  return {
    r: rgbaArray[0],
    g: rgbaArray[1],
    b: rgbaArray[2],
    a: rgbaArray[3],
  }
}

export function castRgbaToArray(rgbaObject: RgbaObject): number[] {
  return [rgbaObject.r, rgbaObject.g, rgbaObject.b, rgbaObject.a]
}
