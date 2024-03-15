import { WKT, GeoJSON } from 'ol/format'

export const idPrefixes = {
  country: 'EuroNat-',
  regionRough: 'Ak',
  regionFine: 'Landsg',
  wattenmeer: 'SH-WATTENMEER-',
}

export const wellKnownText = new WKT()
export const geoJson = new GeoJSON()
