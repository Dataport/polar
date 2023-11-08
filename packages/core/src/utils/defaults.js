/**
 * Since all functions are exported for users, all functions with defaults
 * have to import this object themselves to use fallbacks.
 * @type {object}
 * @default
 * @ignore
 */
export default {
  target: 'map',
  epsg: 'EPSG:25832',
  backgroundImage:
    'https://geoportal-hamburg.de/lgv-config/img/backgroundCanvas.jpeg',
  extent: [510000.0, 5850000.0, 625000.4, 6000000.0],
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
      'EPSG:4326',
      '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',
    ],
  ],
  startResolution: 15.874991427504629,
  startCenter: [565874, 5934140],
  layerConf: 'https://geoportal-hamburg.de/lgv-config/services-internet.json',
  layers: [
    {
      id: '453',
      visibility: true,
    },
  ],
  gazetteerUrl: 'https://geodienste.hamburg.de/HH_WFS_GAGES',
}
