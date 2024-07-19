/* eslint-env jest */

import {
  findLayerTitleInCapabilitiesByName,
  findLegendUrlInCapabilitiesByName,
} from '../src/utils/findInCapabilities'

/**
 * produces GetCapabilities-like object sufficient for testing
 */
const getTestCapabilities = () => ({
  Capability: {
    Layer: {
      Name: 'root',
      Title: 'beer',
      Style: {
        LegendURL: {
          OnlineResource: 'rootbeer.jpeg',
        },
      },
      Layer: [
        {
          Name: 'chip',
          Title: 'tek',
          Layer: {
            Name: 'Typ:',
            Title: 't.u.r.b.o.',
            Style: [
              {
                LegendURL: {
                  OnlineResource: 'supersonic.png',
                },
              },
              {
                LegendURL: {
                  OnlineResource: 'mikrorap.tiff',
                },
              },
              {
                LegendURL: {
                  OnlineResource: 'electrotrash.bmp',
                },
              },
            ],
          },
        },
        {
          Name: 'nun',
          Title: 'chuck',
        },
      ],
    },
  },
})

describe('plugin-layer-chooser', () => {
  describe('utils', () => {
    describe('findLayerTitleInCapabilitiesByName', () => {
      it('finds root titles', () => {
        expect(
          findLayerTitleInCapabilitiesByName(getTestCapabilities(), 'root')
        ).toEqual('beer')
      })
      it('finds nested titles', () => {
        expect(
          ['chip', 'Typ:', 'nun'].map((name) =>
            findLayerTitleInCapabilitiesByName(getTestCapabilities(), name)
          )
        ).toEqual(['tek', 't.u.r.b.o.', 'chuck'])
      })
      it('returns empty string if nothing found', () => {
        expect(
          findLayerTitleInCapabilitiesByName(getTestCapabilities(), 'waldo')
        ).toEqual('')
      })
    })
    describe('findLegendUrlInCapabilitiesByName', () => {
      it('finds a legend url for a layer name', () => {
        expect(
          findLegendUrlInCapabilitiesByName(getTestCapabilities(), 'root')
        ).toBe('rootbeer.jpeg')
      })
      it('returns first url if multiple are found', () => {
        expect(
          findLegendUrlInCapabilitiesByName(getTestCapabilities(), 'Typ:')
        ).toBe('supersonic.png')
      })
      it('returns empty string if no layer is found', () => {
        expect(
          findLegendUrlInCapabilitiesByName(getTestCapabilities(), 'waldo')
        ).toBe('')
      })
      it('returns empty string if layer has no style', () => {
        expect(
          findLegendUrlInCapabilitiesByName(getTestCapabilities(), 'nun')
        ).toBe('')
      })
    })
  })
})
