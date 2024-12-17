import { dishCloudBaseUrl, intranetUrl } from './serviceUrlconstants'

export const denkmaelerWmsIntern = 'denkmaelerWmsIntern'
export const denkmaelerWfsIntern = 'denkmaelerWfsIntern'
export const kontrollbedarfIntern = 'kontrollbedarfIntern'
export const verlustIntern = 'verlustIntern'
export const verwaltung = 'verwaltung'
export const bddEinIntern = 'bddEinIntern'
export const bddColIntern = 'bddColIntern'
export const aerialPhoto = 'aerialPhoto'
export const beschriftung = 'beschriftung'
export const alkisWmsIntern = 'alkisWmsIntern'

// services with url=null: those will be set in the services.ts

export const denkmaelerWfServiceIntern = {
  id: denkmaelerWfsIntern,
  name: 'Denkmäler (WFS)',
  url: null,
  typ: 'WFS',
  version: '2.0.0',
  transparent: true,
  featureType: 'app:TBLGIS_ORA',
}
const denkmaelerWmServiceIntern = {
  id: denkmaelerWmsIntern,
  name: 'Denkmäler (WMS)',
  url: null,
  typ: 'WMS',
  layers: '0,1,2,3,4,6,24,25',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  singleTile: true,
}
const beschriftungService = {
  id: beschriftung,
  name: 'Beschriftung',
  url: null,
  typ: 'WMS',
  layers: '9,10,11,12,13,15,16,17,26,27,35,36,34,33,32,31,30',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  singleTile: true,
}

const kontrollbedarfServiceIntern = {
  id: kontrollbedarfIntern,
  name: 'Objekte mit Kontrollbedarf (WMS)',
  url: null,
  typ: 'WMS',
  layers: '19,20,21,22,23,28,29',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  singleTile: true,
}
const verlustServiceIntern = {
  id: verlustIntern,
  name: 'Verlust',
  url: null,
  typ: 'WMS',
  layers: '7,8',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  singleTile: true,
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

const alkisWmServiceIntern = {
  id: alkisWmsIntern,
  name: 'ALKIS WMS',
  url: `${dishCloudBaseUrl}/bkg/ALKIS_FLST`,
  typ: 'WMS',
  layers: 'adv_alkis_flurstuecke',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  singleTile: true,
  STYLES: 'basemapde',
}

export const servicesIntern = [
  alkisWmServiceIntern,
  denkmaelerWfServiceIntern,
  denkmaelerWmServiceIntern,
  kontrollbedarfServiceIntern,
  verlustServiceIntern,
  beschriftungService,
  verwaltungsGrenzenService,
  bddEinInternService,
  bddColInternService,
  aerialPhotoService,
]
