import { MODE } from './enums'

export const hintergrundkarte = 'hintergrundkarte'
export const denkmaelerWfsExtern = 'denkmaelerWfsExtern'
export const denkmaelerWMS = 'denkmaelerWMS'
export const denkmaelerWmsIntern = 'denkmaelerWmsIntern'
export const denkmaelerWFSIntern = 'denkmaelerWFSIntern'
export const kontrollbedarfIntern = 'kontrollbedarfIntern'
export const alkisWfs = 'alkisWfS'

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

const dishCloudBaseUrl = 'https://dishreserveproxy.dsecurecloud.de/dish'

// TODO
const internServicesBaseUrl = isDevMode
  ? 'http://10.61.63.54:8081/dish-deegree-3.5.0/services/'
  : `#{HIER MUSS NOCH DER RICHTIGE PLATZHALTER REIN}/dish`

export const denkmaelerWmsService = {
  id: denkmaelerWMS,
  name: 'Denkmal WMS',
  url: `${dishDeegreeBaseUrl}/wms_shp`,
  typ: 'WMS',
  layers: '0,1,2,3,4,6,24,25',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
}

export const denkmaelerWfsServiceExtern = {
  id: denkmaelerWfsExtern,
  name: 'Denkmäler (WFS)',
  url: `${dishDeegreeBaseUrl}/wfs_shp`,
  typ: 'WFS',
  version: '2.0.0',
  transparent: true,
  featureType: 'app:dish_shp',
}

export const denkmaelerWfsServiceIntern = {
  id: denkmaelerWFSIntern,
  name: 'Denkmäler (WFS)',
  url: `${internServicesBaseUrl}/wfs`,
  typ: 'WFS',
  version: '2.0.0',
  transparent: true,
  featureType: 'app:TBLGIS_ORA',
}
const denkmaelerWMsServiceIntern = {
  id: denkmaelerWmsIntern,
  name: 'Denkmäler (WMS)',
  url: `${internServicesBaseUrl}/wms`,
  typ: 'WMS',
  layers: '0,1,2,3,4,6,24,25',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
}
const kontrollbedarfServiceIntern = {
  id: kontrollbedarfIntern,
  name: 'Objekte mit Kontrollbedarf (WMS)',
  url: `${internServicesBaseUrl}/wms`,
  typ: 'WMS',
  layers: '28,29,23,22,21,20,19',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
}
const AlkisWfService = {
  id: alkisWfs,
  name: 'ALKIS',
  url: `${dishCloudBaseUrl}/bkg/ALKIS_WFS`,
  typ: 'WFS',
  version: '2.0.0',
  transparent: true,
  featureType: 'ave:Flurstueck',
}

const servicesCommon = [
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
  denkmaelerWmsService,
]

const servicesExtern = [AlkisWfService, denkmaelerWfsServiceExtern]

const servicesIntern = [
  denkmaelerWfsServiceIntern,
  denkmaelerWMsServiceIntern,
  kontrollbedarfServiceIntern,
]

export const services = (mode: keyof typeof MODE) => [
  ...servicesCommon,
  ...(mode === MODE.EXTERN ? servicesExtern : servicesIntern),
]
