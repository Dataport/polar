import { WKT, GeoJSON } from 'ol/format'

export const ignoreIds = {
  global: ['EuroNat-33'],
  geometries: [
    'EuroNat-33',
    'SH-WATTENMEER-DM-1',
    'SH-WATTENMEER-1',
    'Ak2006-51529',
    'Landsg-2016-110',
  ],
}
export const wellKnownText = new WKT()
export const geoJson = new GeoJSON()
