// NOTE: action tests currently not type-supported, but working
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PolarActionHandler } from '@polar/lib-custom-types'
import { makeActions } from '../store/actions'
import { GfiState, GfiGetters } from '../../src/types'

jest.mock('../utils/requestGfi', () => ({
  requestGfi: jest.fn(() => Promise.resolve([])),
}))

jest.mock('../utils/displayFeatureLayer', () => ({
  getFeatureDisplayLayer: jest.fn(),
  addFeature: jest.fn(),
  clear: jest.fn(),
}))

describe('GFI Actions', () => {
  const actions = makeActions()
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })
  it('should call getFeatureInfo with the correct parameters', async () => {
    const dispatch = jest.fn()
    const coordinate = [0, 0]

    const rootGetters = {
      map: {
        getLayers: () => ({
          getArray: () => [],
        }),
        getView: () => ({
          getProjection: () => ({
            getCode: () => 'EPSG:4326',
          }),
        }),
      },
    }
    const configuration = {
      gfi: {
        layers: {},
        mode: 'bboxDot',
        maxFeatures: 10,
      },
    }
    const getters = {
      layerKeys: ['layer1'],
      geometryLayerKeys: [],
      afterLoadFunction: null,
    }

    const context = {
      commit: jest.fn(),
      dispatch,
      rootGetters,
      configuration,
      getters,
    }

    const getFeatureInfo = actions.getFeatureInfo as PolarActionHandler<
      GfiState,
      GfiGetters
    >
    // @ts-ignore
    await getFeatureInfo(context, coordinate)

    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith('debouncedGfiRequest', coordinate)
  })
  it('should fetch and process features', async () => {
    const commit = jest.fn()
    const rootGetters = {
      map: {
        getLayers: () => ({
          getArray: () => [],
        }),
        getView: () => ({
          getProjection: () => ({
            getCode: () => 'EPSG:4326',
          }),
        }),
      },
      configuration: {
        gfi: {
          layers: {
            layer1: {
              maxFeatures: 10,
            },
          },
          mode: 'bboxDot',
          maxFeatures: 10,
        },
      },
    }
    const getters = {
      layerKeys: ['layer1'],
      geometryLayerKeys: ['layer1'],
      afterLoadFunction: null,
    }

    const context = {
      commit,
      rootGetters,
      getters,
    }

    const coordinate = [0, 0]
    const layerResponse = []

    const allSettledResult = [{ status: 'fulfilled', value: layerResponse }]
    const allSettledMock = jest.spyOn(Promise, 'allSettled')
    // @ts-ignore
    allSettledMock.mockResolvedValue(allSettledResult)

    const debounceMock = jest.fn((fn) => fn)
    jest.mock('lodash', () => ({
      debounce: debounceMock,
    }))

    const debouncedFunction = actions.debouncedGfiRequest as PolarActionHandler<
      GfiState,
      GfiGetters
    >
    // @ts-ignore
    const debouncedPromise = debouncedFunction(context, coordinate)
    // @ts-ignore
    jest.runAllTimers()

    await debouncedPromise

    expect(context.commit).toHaveBeenCalledTimes(1)
    expect(context.commit).toHaveBeenCalledWith('setFeatureInformation', {
      layer1: [],
    })
  })
  it('should handle failed feature request', async () => {
    const commit = jest.fn()
    const rootGetters = {
      map: {
        getLayers: () => ({
          getArray: () => [],
        }),
        getView: () => ({
          getProjection: () => ({
            getCode: () => 'EPSG:4326',
          }),
        }),
      },
      configuration: {
        gfi: {
          layers: {
            layer1: {
              maxFeatures: 10,
            },
          },
          mode: 'bboxDot',
          maxFeatures: 10,
        },
      },
    }
    const getters = {
      layerKeys: ['layer1'],
      geometryLayerKeys: ['layer1'],
      afterLoadFunction: null,
    }

    const context = {
      commit,
      rootGetters,
      getters,
    }

    const coordinate = [0, 0]

    const allSettledResult = [
      {
        status: 'rejected',
        reason: { message: 'Feature request failed' },
      },
    ]
    const allSettledMock = jest.spyOn(Promise, 'allSettled')
    // @ts-ignore
    allSettledMock.mockResolvedValue(allSettledResult)

    const debounceMock = jest.fn((fn) => fn)
    jest.mock('lodash', () => ({
      debounce: debounceMock,
    }))

    const debouncedFunction = actions.debouncedGfiRequest as PolarActionHandler<
      GfiState,
      GfiGetters
    >
    // @ts-ignore
    const debouncedPromise = debouncedFunction(context, coordinate)
    // @ts-ignore
    jest.runAllTimers()

    await debouncedPromise

    expect(context.commit).toHaveBeenCalledTimes(1)
    expect(context.commit).toHaveBeenCalledWith('setFeatureInformation', {
      layer1: expect.any(Symbol),
    })
  })
})
