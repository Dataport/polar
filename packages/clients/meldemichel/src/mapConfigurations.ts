import {
  AddressSearchConfiguration,
  Attribution,
  AttributionsConfiguration,
  GeoLocationConfiguration,
  LayerConfiguration,
  MapConfig,
  PinsConfiguration,
  ReverseGeocoderConfiguration,
} from '@polar/lib-custom-types'
import { MODE } from './enums'
import language from './language'
import { MeldemichelCreateMapParams } from './types'

const stadtplan = '453'
const luftbilder = '452'
export const hamburgBorder = '6074' // boundary layer for pins / geolocalization

const hamburgWhite = '#ffffff'
const hamburgDarkBlue = '#003063'
const hamburgRed = '#ff0019'

const commonMapConfiguration: Partial<MapConfig> = {
  checkServiceAvailability: false, // service register too long
  epsg: 'EPSG:25832',
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
  namedProjections: [
    [
      'EPSG:25832',
      '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    ],
    [
      'EPSG:4326',
      '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',
    ],
  ],
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
      // @ts-expect-error | missing field "epsg" filled later in process
      queryParameters: {
        searchAddress: true,
        searchStreets: true,
        searchHouseNumbers: true,
      },
      type: 'mpapi',
      url: 'https://geodienste.hamburg.de/HH_WFS_GAGES?service=WFS&request=GetFeature&version=2.0.0',
    },
  ],
  minLength: 3,
  waitMs: 300,
}

const commonPins: Partial<PinsConfiguration> = {
  // TODO must work separate to GFI (clicking !== selecting, in Meldemichel)
  toZoomLevel: 7,
  movable: true,
  style: {
    fill: hamburgRed,
  },
  boundaryLayerId: hamburgBorder,
}

const reverseGeocoder: Partial<ReverseGeocoderConfiguration> = {
  coordinateSource: 'plugin/pins/transformedCoordinate',
  addressTarget: 'plugin/addressSearch/selectResult',
}

const geoLocation: Partial<GeoLocationConfiguration> = {
  checkLocationInitially: true,
  zoomLevel: 7,
  boundaryLayerId: hamburgBorder,
  boundaryOnError: 'strict',
  showTooltip: true,
}

const mapConfigurations: Record<
  string,
  (reportServiceId: string, afmUrl: string) => object
> = {
  [MODE.COMPLETE]: (reportServiceId: string, afmUrl: string) => {
    return {
      ...commonMapConfiguration,
      addressSearch,
      layers: [
        ...commonLayers,
        {
          // TODO implement grouping & spider for this one
          // TODO features visible as single, group, selected (green)
          id: reportServiceId,
          visibility: true,
          distance: 30,
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
      geoLocation,
      gfi: {
        mode: 'bboxDot',
        layers: {
          [reportServiceId]: {
            // TODO doesn't work atm; no coordinate source
            geometry: false,
            window: true,
            properties: { filename: 'Name of file' },
          },
        },
        coordinateSources: [], // to be set in addPlugins.ts
      },
      pins: commonPins,
      reverseGeocoder,
      meldemichelAfmButton: {
        displayComponent: true,
        afmUrl,
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
    layers: commonLayers,
    attributions: {
      ...commonAttributions,
    },
    pins: commonPins,
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
    // @ts-expect-error | reportServiceId might be undefined, but that's catched above for relevant cases
    ...mapConfigurations[mode](reportServiceId, afmUrl),
  }
}
