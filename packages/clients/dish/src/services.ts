import { MODE } from './enums'

export const hintergrundkarte = 'hintergrundkarte'
export const denkmaelerWfsExtern = 'denkmaelerWfsExtern'
export const denkmaelerWMS = 'denkmaelerWMS'
export const denkmaelerWmsIntern = 'denkmaelerWmsIntern'
export const denkmaelerWFSIntern = 'denkmaelerWFSIntern'
export const kontrollbedarfIntern = 'kontrollbedarfIntern'
export const verlustIntern = 'verlustIntern'
export const alkisWfs = 'alkisWfS'
export const alkisWms = 'alkisWms'
export const dop20col = 'dop20col'
export const dop20sw = 'dop20sw'
export const verwaltung = 'verwaltung'
export const bddCol = 'bddCol'
export const bddEin = 'bddEin'

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

export const dishCloudBaseUrl = 'https://dishreserveproxy.dsecurecloud.de'

// TODO
export const internServicesBaseUrl = isDevMode
  ? 'http://10.61.63.54:8081/dish-deegree-3.5.0/services'
  : `#{HIER MUSS NOCH DER RICHTIGE PLATZHALTER REIN}`

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
  layers: '6,15,24,26,25,27,4,13,3,12,2,11,1,10,0,9',
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
  layers: '28,35,29,36,23,34,22,33,21,32,20,31,19,30',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
}
const verlustServiceIntern = {
  id: verlustIntern,
  name: 'Verlust',
  url: `${internServicesBaseUrl}/wms`,
  typ: 'WMS',
  layers: '7,8,16,17',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
}
const AlkisWfService = {
  id: alkisWfs,
  name: 'ALKIS',
  url: `${dishCloudBaseUrl}/dish/bkg/ALKIS_WFS`,
  typ: 'WFS',
  version: '2.0.0',
  transparent: true,
  featureType: 'ave:Flurstueck',
}

const AlkisWmService = {
  id: alkisWms,
  name: 'ALKIS WMS',
  url: `${dishCloudBaseUrl}/bkg/ALKIS_FLST`,
  typ: 'WMS',
  layers: 'adv_alkis_flurstuecke',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  STYLES: 'basemapde',
}

const dop20ColService = {
  id: dop20col,
  name: 'DOP 20 (Farbe)',
  url: `${dishCloudBaseUrl}/dish/bkg/DOP20col`,
  typ: 'WMS',
  layers: 'DOP20COL',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
}

const dop20swService = {
  id: dop20sw,
  name: 'DOP 20 (SW)',
  url: `${dishCloudBaseUrl}/dish/bkg/DOP20sw`,
  typ: 'WMS',
  layers: 'DOP20sw',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
}

const bddColService = {
  id: bddCol,
  name: 'BDD (Mehrfarbe)',
  url: `${dishCloudBaseUrl}/dish/bkg/BDDcol`,
  typ: 'WMS',
  layers: 'BDDCOL_V2',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
}

const bddEinService = {
  id: bddEin,
  name: 'BDD (Einfarbig)',
  url: `${dishCloudBaseUrl}/dish/bkg/BDDein`,
  typ: 'WMS',
  layers: 'BDDEIN_V2',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
}

const verwaltungsGrenzenService = {
  id: verwaltung,
  name: 'Verwaltungsgrenzen',
  url: `https://intranet.gdi-sh.lr.landsh.de/WMS_SH_VwG`,
  typ: 'WMS',
  layers: 'Landesgrenzen,Kreisgrenzen,Aemtergrenzen,Gemeindegrenzen',
  format: 'image/png',
  version: '1.0.0',
  transparent: true,
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
  AlkisWfService,
  AlkisWmService,
]

const servicesExtern = [
  denkmaelerWmsService,
  denkmaelerWfsServiceExtern,
  dop20ColService,
  dop20swService,
  bddColService,
  bddEinService,
]

const servicesIntern = [
  denkmaelerWfsServiceIntern,
  denkmaelerWMsServiceIntern,
  kontrollbedarfServiceIntern,
  verlustServiceIntern,
  verwaltungsGrenzenService,
]

export const services = (mode: keyof typeof MODE) => [
  ...servicesCommon,
  ...(mode === MODE.EXTERN ? servicesExtern : servicesIntern),
]
