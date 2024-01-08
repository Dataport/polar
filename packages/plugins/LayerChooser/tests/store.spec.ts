/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { makeStoreModule } from '../src/store'

describe('plugin-layerchooser', () => {
  describe('store', () => {
    describe('actions', () => {
      describe('toggleOpenedOptionsServiceLayer', () => {
        const storeModule = makeStoreModule()
        const toggleOpenedOptionsServiceLayer = storeModule.actions!
          .toggleOpenedOptionsServiceLayer as (x: object, y: number[]) => void

        let updateParams, context

        beforeEach(() => {
          updateParams = jest.fn()
          context = {
            commit: jest.fn(),
            rootGetters: {
              map: {
                getLayers: () => ({
                  getArray: () => ({
                    find: jest.fn(() => ({
                      getSource: () => ({
                        getParams: () => ({
                          testParam: Symbol.for('testParam'),
                        }),
                        updateParams,
                      }),
                    })),
                  }),
                }),
              },
            },
            getters: {
              openedOptionsService: { id: 'test_id' },
              openedOptionsServiceLayers: [
                { layerName: 0 },
                { layerName: 1 },
                { layerName: 2 },
              ],
              activeLayerIds: {},
            },
          }
        })

        it('recreates original layer order', () => {
          toggleOpenedOptionsServiceLayer(context, [1, 2])

          expect(updateParams.mock.calls[0][0]).toEqual({
            testParam: Symbol.for('testParam'),
            LAYERS: [2, 1],
          })
          expect(context.commit.mock.calls[0]).toEqual([
            'setActiveLayerIds',
            {
              test_id: [2, 1],
            },
          ])
        })
      })
    })
  })
})
