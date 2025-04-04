// NOTE: action tests currently not type-supported, but working
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { makeActions } from '../src/store/actions'

jest.mock('../src/utils/requestGfi', () => ({
  requestGfi: jest.fn(() => Promise.resolve([])),
}))

jest.mock('../src/utils/displayFeatureLayer', () => ({
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
      gfiConfiguration: configuration.gfi,
    }

    const context = {
      commit: jest.fn(),
      dispatch,
      rootGetters,
      configuration,
      getters,
    }

    const getFeatureInfo = actions.getFeatureInfo
    // @ts-ignore
    await getFeatureInfo(context, coordinate)

    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith('debouncedGfiRequest', coordinate)
  })
  it('should fetch and process features', async () => {
    const commit = jest.fn()
    const configuration = {
      gfi: {
        layers: {
          layer1: {
            maxFeatures: 10,
          },
        },
        mode: 'bboxDot',
        maxFeatures: 10,
      },
    }
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
      configuration,
    }
    const getters = {
      layerKeys: ['layer1'],
      geometryLayerKeys: ['layer1'],
      afterLoadFunction: null,
      gfiConfiguration: configuration.gfi,
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

    const debouncedFunction = actions.debouncedGfiRequest
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
    const configuration = {
      gfi: {
        layers: {
          layer1: {
            maxFeatures: 10,
          },
        },
        mode: 'bboxDot',
        maxFeatures: 10,
      },
    }
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
      configuration,
    }
    const getters = {
      layerKeys: ['layer1'],
      geometryLayerKeys: ['layer1'],
      afterLoadFunction: null,
      gfiConfiguration: configuration.gfi,
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

    const debouncedFunction = actions.debouncedGfiRequest
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
