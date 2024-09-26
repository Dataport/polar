import { MasterportalApiConfig, PartialBy } from '@polar/lib-custom-types'

// Default configuration parameters for @masterportal/masterportalapi
export default {
  epsg: 'EPSG:25832',
  options: [
    { resolution: 66.14579761460263, scale: 250000, zoomLevel: 0 },
    { resolution: 26.458319045841044, scale: 100000, zoomLevel: 1 },
    { resolution: 15.874991427504629, scale: 60000, zoomLevel: 2 },
    { resolution: 10.583327618336419, scale: 40000, zoomLevel: 3 },
    { resolution: 5.2916638091682096, scale: 20000, zoomLevel: 4 },
    { resolution: 2.6458319045841048, scale: 10000, zoomLevel: 5 },
    { resolution: 1.3229159522920524, scale: 5000, zoomLevel: 6 },
    { resolution: 0.6614579761460262, scale: 2500, zoomLevel: 7 },
    { resolution: 0.2645831904584105, scale: 1000, zoomLevel: 8 },
    { resolution: 0.1322915952292052, scale: 500, zoomLevel: 9 },
  ],
  namedProjections: [
    [
      'EPSG:25832',
      '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    ],
    [
      'EPSG:3857',
      '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs',
    ],
    [
      'EPSG:4326',
      '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',
    ],
    [
      'EPSG:31467',
      '+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +nadgrids=BETA2007.gsb +units=m +no_defs +type=crs',
    ],
    [
      'EPSG:4647',
      '+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=32500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    ],
  ],
  startResolution: 15.874991427504629,
} as PartialBy<
  // The type is this weird as CoreState.configuration has some values required ...
  MasterportalApiConfig &
    Required<
      Pick<
        MasterportalApiConfig,
        'epsg' | 'namedProjections' | 'options' | 'startResolution'
      >
    >,
  'layerConf' | 'startCenter'
>
