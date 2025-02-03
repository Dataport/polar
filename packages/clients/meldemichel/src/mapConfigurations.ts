import {
  AddressSearchConfiguration,
  Attribution,
  AttributionsConfiguration,
  FilterConfiguration,
  GeoLocationConfiguration,
  LayerConfiguration,
  MapConfig,
  PinsConfiguration,
  ReverseGeocoderConfiguration,
} from '@polar/lib-custom-types'
import { MpApiParameters } from '@polar/plugin-address-search'
import { MODE, SKAT, REPORT_STATUS } from './enums'
import language from './language'
import { MeldemichelCreateMapParams } from './types'
import { showTooltip } from './utils/showTooltip'

export const stadtwald = '18746'
const stadtplan = '453'
const luftbilder = '452'
export const hamburgBorder = '1693' // boundary layer for pins / geolocalization

const hamburgWhite = '#ffffff'
const hamburgDarkBlue = '#003063'
const hamburgRed = '#ff0019'

const commonMapConfiguration: Partial<MapConfig> = {
  checkServiceAvailability: false, // service register too long
  locales: language,
  vuetify: {
    theme: {
      themes: {
        light: {
          primary: hamburgDarkBlue,
          primaryContrast: hamburgWhite,
          secondary: hamburgWhite,
          secondaryContrast: hamburgDarkBlue,
        },
      },
    },
  },
}

const commonLayers: LayerConfiguration[] = [
  {
    id: stadtplan,
    visibility: true,
    type: 'background',
    name: 'meldemichel.layers.stadtplan',
  },
  {
    id: luftbilder,
    type: 'background',
    name: 'meldemichel.layers.luftbilder',
  },
  {
    id: hamburgBorder,
    visibility: true,
    hideInMenu: true,
    type: 'mask',
    name: 'meldemichel.layers.hamburgBorder',
  },
]

const commonAttributions: Partial<AttributionsConfiguration> = {
  initiallyOpen: false,
  layerAttributions: [
    {
      id: stadtplan,
      title: 'meldemichel.attributions.stadtplan',
    },
    {
      id: luftbilder,
      title: 'meldemichel.attributions.luftbilder',
    },
  ],
}

const addressSearch: AddressSearchConfiguration = {
  searchMethods: [
    {
      queryParameters: {
        searchAddress: true,
        searchStreets: true,
        searchHouseNumbers: true,
      } as MpApiParameters,
      type: 'mpapi',
      url: 'https://geodienste.hamburg.de/HH_WFS_GAGES?service=WFS&request=GetFeature&version=2.0.0',
    },
  ],
  minLength: 3,
  waitMs: 300,
}

const commonPins: Partial<PinsConfiguration> = {
  toZoomLevel: 7,
  movable: 'drag',
  style: {
    fill: hamburgRed,
  },
  boundaryLayerId: hamburgBorder,
}

const reverseGeocoder: Partial<ReverseGeocoderConfiguration> = {
  coordinateSource: 'plugin/pins/transformedCoordinate',
  addressTarget: 'plugin/addressSearch/selectResult',
}

const getFilterConfiguration = (id: string): FilterConfiguration => ({
  layers: {
    [id]: {
      categories: [
        {
          selectAll: true,
          targetProperty: 'skat',
          knownValues: [...SKAT],
        },
        {
          targetProperty: 'statu',
          knownValues: [...REPORT_STATUS],
        },
      ],
      time: {
        targetProperty: 'start',
        pattern: 'YYYYMMDD',
        last: [
          {
            amounts: [7, 30],
          },
        ],
        freeSelection: {
          now: 'until',
        },
      },
    },
  },
})

const geoLocation: Partial<GeoLocationConfiguration> = {
  checkLocationInitially: true,
  zoomLevel: 7,
  boundaryLayerId: hamburgBorder,
  boundaryOnError: 'strict',
  showTooltip: true,
}

const mapConfigurations: Record<
  keyof typeof MODE,
  (reportServiceId: string, afmUrl: string) => object
> = {
  // this is acceptable for configuration
  // eslint-disable-next-line max-lines-per-function
  [MODE.COMPLETE]: (reportServiceId: string, afmUrl: string) => {
    return {
      ...commonMapConfiguration,
      extendedMasterportalapiMarkers: {
        layers: [reportServiceId],
        defaultStyle: {
          stroke: '#FFFFFF',
          fill: '#005CA9',
        },
        hoverStyle: {
          stroke: '#46688E',
          fill: '#8BA1B8',
        },
        selectionStyle: {
          stroke: '#FFFFFF',
          fill: '#E10019',
        },
        clusterClickZoom: true,
        dispatchOnMapSelect: ['plugin/iconMenu/openMenuById', 'gfi'],
      },
      addressSearch,
      layers: [
        ...commonLayers,
        {
          id: reportServiceId,
          visibility: true,
          type: 'mask',
          name: 'meldemichel.layers.reports',
        } as LayerConfiguration,
      ],
      attributions: {
        ...commonAttributions,
        layerAttributions: [
          ...(commonAttributions.layerAttributions as Attribution[]),
          {
            id: reportServiceId,
            title: 'meldemichel.attributions.reports',
          },
        ],
        staticAttributions: [
          '<a href="https://www.hamburg.de/impressum/" target="_blank">Impressum</a>',
        ],
      },
      filter: getFilterConfiguration(reportServiceId),
      geoLocation,
      gfi: {
        mode: 'bboxDot',
        activeLayerPath: 'plugin/layerChooser/activeMaskIds',
        layers: {
          [reportServiceId]: {
            geometry: false,
            window: true,
            // translation in meldemichel's local gfi override
            properties: [
              'str',
              'hsnr',
              'pic',
              'skat',
              'beschr',
              'rueck',
              'start',
              'statu',
            ],
            showTooltip,
          },
        },
      },
      pins: commonPins,
      reverseGeocoder,
      meldemichel: {
        afmButton: { afmUrl },
      },
    }
  },
  [MODE.REPORT]: () => ({
    ...commonMapConfiguration,
    addressSearch,
    layers: commonLayers,
    attributions: {
      ...commonAttributions,
    },
    geoLocation,
    pins: commonPins,
    reverseGeocoder,
  }),
  [MODE.SINGLE]: () => ({
    ...commonMapConfiguration,
    addressSearch,
    layers: [
      ...commonLayers,
      {
        id: stadtwald,
        visibility: false,
        type: 'mask',
        name: 'meldemichel.layers.stadtwald',
      } as LayerConfiguration,
    ],
    attributions: {
      ...commonAttributions,
      layerAttributions: [
        ...(commonAttributions.layerAttributions as Attribution[]),
        {
          id: stadtwald,
          title: 'meldemichel.attributions.stadtwald',
        },
      ],
    },
    pins: commonPins,
    reverseGeocoder,
  }),
}

export const getMapConfiguration = ({
  mode,
  afmUrl,
  reportServiceId,
}: Pick<
  MeldemichelCreateMapParams,
  'mode' | 'afmUrl' | 'reportServiceId'
>): Partial<MapConfig> => {
  if (mode === MODE.COMPLETE && typeof reportServiceId === 'undefined') {
    throw new Error(
      'POLAR Meldemichel Client: Missing reportServiceId configuration in mode COMPLETE.'
    )
  }
  return {
    // @ts-expect-error | reportServiceId might be undefined, but that's caught above for relevant cases
    ...mapConfigurations[mode](reportServiceId, afmUrl),
  }
}
