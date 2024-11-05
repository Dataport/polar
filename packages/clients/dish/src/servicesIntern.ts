import { isDevMode } from './services'

export const denkmaelerWmsIntern = 'denkmaelerWmsIntern'
export const denkmaelerWfsIntern = 'denkmaelerWfsIntern'
export const kontrollbedarfIntern = 'kontrollbedarfIntern'
export const verlustIntern = 'verlustIntern'
export const verwaltung = 'verwaltung'
export const bddEinIntern = 'bddEinIntern'
export const bddColIntern = 'bddColIntern'
export const aerialPhoto = 'aerialPhoto'

export const intranetUrl = 'https://intranet.gdi-sh.lr.landsh.de'

// TODO
export const internServicesBaseUrl = isDevMode
  ? 'http://10.61.63.54:8081/dish-deegree-3.5.0/services'
  : `#{HIER MUSS NOCH DER RICHTIGE PLATZHALTER REIN}`

// TODO do I need replacements here too?
export const exportMapAsPdfUrl =
  'http://10.61.63.54/Content/Objekt/Kartenausgabe.aspx'

// TODO do I need replacements here too?
export const printImageURL = 'http://10.61.134.23/Content/MapsTmp'

export const denkmaelerWfServiceIntern = {
  id: denkmaelerWfsIntern,
  name: 'Denkmäler (WFS)',
  url: `${internServicesBaseUrl}/wfs`,
  typ: 'WFS',
  version: '2.0.0',
  transparent: true,
  featureType: 'app:TBLGIS_ORA',
}
const denkmaelerWmServiceIntern = {
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

const verwaltungsGrenzenService = {
  id: verwaltung,
  name: 'Verwaltungsgrenzen',
  url: `${intranetUrl}/WMS_SH_VwG`,
  typ: 'WMS',
  layers: 'Landesgrenzen,Kreisgrenzen,Aemtergrenzen,Gemeindegrenzen',
  format: 'image/png',
  version: '1.1.1',
  transparent: true,
}

const bddEinInternService = {
  id: bddEinIntern,
  name: 'Grundkarte Graustufen',
  url: `${intranetUrl}/WMS_SH_BDDein_v2`,
  typ: 'WMS',
  layers: 'UEK1500,UEK1000,UEK250,DTK100ein,DTK50ein,DTK25ein,DTK5ein',
  format: 'image/png',
  version: '1.1.1',
  transparent: true,
}

const bddColInternService = {
  id: bddColIntern,
  name: 'Grundkarte Farbe',
  url: `${intranetUrl}/WMS_SH_BDDcol_v2`,
  typ: 'WMS',
  layers: 'UEK1500,UEK1000,UEK250,DTK100col,DTK50col,DTK25col,DTK5col',
  format: 'image/png',
  version: '1.1.1',
  transparent: true,
}

const aerialPhotoService = {
  id: aerialPhoto,
  name: 'Luftbilder Farbe',
  url: `${intranetUrl}/WMS_SH_DOP20col`,
  typ: 'WMS',
  layers: 'SH_DOP20_4,SH_DOP20_3,SH_DOP20_2,SH_DOP20_1',
  format: 'image/png',
  version: '1.1.1',
  transparent: true,
}

export const servicesIntern = [
  denkmaelerWfServiceIntern,
  denkmaelerWmServiceIntern,
  kontrollbedarfServiceIntern,
  verlustServiceIntern,
  verwaltungsGrenzenService,
  bddEinInternService,
  bddColInternService,
  aerialPhotoService,
]
