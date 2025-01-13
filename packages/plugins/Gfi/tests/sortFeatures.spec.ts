import { Feature as GeoJsonFeature, LineString, Point, Polygon } from 'geojson'
import sortFeatures from '../src/utils/sortFeatures'

describe('sortFeatures', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  describe('sorting two features', () => {
    it('should sort the features by area (biggest first) if both are Polygons', () => {
      const featureA: GeoJsonFeature<Polygon> = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [10.5, 59],
              [15, 59],
              [15, 56],
              [10, 56],
              [10.5, 59],
            ],
          ],
        },
        properties: {},
      }
      const featureB: GeoJsonFeature<Polygon> = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-4.25, 62],
              [27.5, 62],
              [26.5, 45],
              [-4.25, 50],
              [-4.5, 62.25],
            ],
          ],
        },
        properties: {},
      }
      expect(
        [featureA, featureB].sort((a, b) => sortFeatures(a, b, 'EPSG:4326'))
      ).toEqual([featureB, featureA])
    })
    it('should put the Polygon feature first if the other feature is not a Polygon', () => {
      const featureA: GeoJsonFeature<LineString> = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [1.5, 55],
            [20, 55],
          ],
        },
        properties: {},
      }
      const featureB: GeoJsonFeature<Polygon> = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [10.5, 59],
              [15, 59],
              [15, 56],
              [10, 56],
              [10.5, 59],
            ],
          ],
        },
        properties: {},
      }
      expect(
        [featureA, featureB].sort((a, b) => sortFeatures(a, b, 'EPSG:4326'))
      ).toEqual([featureB, featureA])
    })
    it('should should keep the original order if both features are LineStrings', () => {
      const featureA: GeoJsonFeature<LineString> = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [1.5, 55],
            [20, 55],
          ],
        },
        properties: {},
      }
      const featureB: GeoJsonFeature<LineString> = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [1.5, 55],
            [20, 55],
            [10, 56],
          ],
        },
        properties: {},
      }
      expect(
        [featureA, featureB].sort((a, b) => sortFeatures(a, b, 'EPSG:4326'))
      ).toEqual([featureA, featureB])
    })
    it('should put the LineString feature first if the other feature is a Point Feature', () => {
      const featureA: GeoJsonFeature<Point> = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [1.5, 55],
        },
        properties: {},
      }
      const featureB: GeoJsonFeature<LineString> = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [1.5, 55],
            [20, 55],
            [10, 56],
          ],
        },
        properties: {},
      }
      expect(
        [featureA, featureB].sort((a, b) => sortFeatures(a, b, 'EPSG:4326'))
      ).toEqual([featureB, featureA])
    })
    it('should should keep the original order if both features are Points', () => {
      const featureA: GeoJsonFeature<Point> = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [1.5, 55],
        },
        properties: {},
      }
      const featureB: GeoJsonFeature<Point> = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [55, 1.5],
        },
        properties: {},
      }
      expect(
        [featureA, featureB].sort((a, b) => sortFeatures(a, b, 'EPSG:4326'))
      ).toEqual([featureA, featureB])
    })
  })
  describe('sorting more than two features', () => {
    it('should order the features by Polygons first, then LineStrings and lastly Points', () => {
      const featureA: GeoJsonFeature<LineString> = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [1.5, 55],
            [20, 55],
          ],
        },
        properties: {},
      }
      const featureB: GeoJsonFeature<LineString> = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [1.5, 55],
            [20, 55],
            [10, 56],
          ],
        },
        properties: {},
      }
      const featureC: GeoJsonFeature<Point> = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [1.5, 55],
        },
        properties: {},
      }
      const featureD: GeoJsonFeature<Polygon> = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [10.5, 59],
              [15, 59],
              [15, 56],
              [10, 56],
              [10.5, 59],
            ],
          ],
        },
        properties: {},
      }
      const featureE: GeoJsonFeature<Point> = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [55, 1.5],
        },
        properties: {},
      }
      const featureF: GeoJsonFeature<Polygon> = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-4.25, 62],
              [27.5, 62],
              [26.5, 45],
              [-4.25, 50],
              [-4.5, 62.25],
            ],
          ],
        },
        properties: {},
      }
      expect(
        [featureA, featureB, featureC, featureD, featureE, featureF].sort(
          (a, b) => sortFeatures(a, b, 'EPSG:4326')
        )
      ).toEqual([featureF, featureD, featureA, featureB, featureC, featureE])
    })
  })
})
