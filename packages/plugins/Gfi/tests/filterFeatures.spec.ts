import { filterFeatures } from '../src/utils/filterFeatures'

describe('filterFeatures', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  it('should return an object with only GeoJsonFeature[] as its values if the values were already only GeoJsonFeature[]', () => {
    expect(
      Object.keys(
        filterFeatures({
          idOne: [
            {
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [0, 0] },
              properties: { goodFeature: true },
            },
          ],
          idTwo: [
            {
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [1, 1] },
              properties: { goodFeature: true },
            },
            {
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [0, 1] },
              properties: { goodFeature: false },
            },
          ],
        })
      ).length
    ).toBe(2)
  })
  it('should return an object with less keys if some values are symbols', () => {
    expect(
      Object.keys(
        filterFeatures({
          idOne: Symbol('failing'),
          idTwo: [
            {
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [1, 1] },
              properties: { goodFeature: true },
            },
            {
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [0, 1] },
              properties: { goodFeature: false },
            },
          ],
        })
      ).length
    ).toBe(1)
  })
  it('should return an empty object if all values are symbols', () => {
    expect(
      Object.keys(
        filterFeatures({
          idOne: Symbol('failing'),
          idTwo: Symbol('another fail'),
        })
      ).length
    ).toBe(0)
  })
})
