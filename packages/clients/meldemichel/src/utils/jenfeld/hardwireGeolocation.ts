import { jenfeldhausCoordinate } from './jenfeldhausCoordinate'

/**
 * The GeoLocation feature in the Jenfeld client is currently turned off.
 * This call mimicks the geolocation of the display element by just entering its position hard.
 */
export const hardwireGeolocation = (client) => {
  client.$store.dispatch('plugin/geoLocation/addMarker', jenfeldhausCoordinate) // Jenfeldhaus (Koordinate der Adresse "Charlottenburger Straße 1")
}
