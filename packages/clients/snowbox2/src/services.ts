export const hintergrundkarte = 'hintergrundkarte'

export const WMS_SH_ALKIS_Fluren_Gemarkungen = 'WMS_SH_ALKIS_Fluren_Gemarkungen'

export const servicePrefix = 'https://stage.afm.schleswig-holstein.de/bkg/'

export const isDevMode = process.env.NODE_ENV === 'development'

/* NOTE
 * #{} codes are read by Octopus Deploy.
 * It injects the deployment environment in those locations.
 */

export const dishDeegreeBaseUrl = isDevMode
  ? 'https://efi2-deegree.schleswig-holstein.de/dish-deegree/services'
  : `#{Project.deegree.URL}/dish-deegree/services`

export const dishBaseUrl = isDevMode
  ? 'https://efi2.schleswig-holstein.de/dish'
  : `#{LS.EFI.IIS.App.URL}/dish`

export const dishAutocompleteUrl = `${dishBaseUrl}/dish_suche/ergebnisse/json/alleBezeichnungenEindeutig.JSON`

export const services = [
  {
    id: hintergrundkarte,
    name: 'WMS DE BASEMAP.DE WEB RASTER',
    url: 'https://sgx.geodatenzentrum.de/wms_basemapde',
    typ: 'WMS',
    layers: 'de_basemapde_web_raster_grau',
    format: 'image/png',
    version: '1.3.0',
    singleTile: false,
    transparent: true,
  },
  {
    id: WMS_SH_ALKIS_Fluren_Gemarkungen,
    name: 'Fluren und Gemarkungen',
    url: 'https://service.gdi-sh.de/WMS_SH_ALKIS_Fluren_Gemarkungen',
    typ: 'WMS',
    format: 'image/png',
    version: '1.3.0',
    transparent: true,
    layers: ['Flur', 'Gemarkung'],
  },
]
