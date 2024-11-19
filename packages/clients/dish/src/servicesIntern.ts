export const denkmaelerWmsIntern = 'denkmaelerWmsIntern'
export const denkmaelerWfsIntern = 'denkmaelerWfsIntern'
export const kontrollbedarfIntern = 'kontrollbedarfIntern'
export const verlustIntern = 'verlustIntern'
export const verwaltung = 'verwaltung'
export const bddEinIntern = 'bddEinIntern'
export const bddColIntern = 'bddColIntern'
export const aerialPhoto = 'aerialPhoto'
export const beschriftung = 'beschriftung'

export const intranetUrl = 'https://intranet.gdi-sh.lr.landsh.de'

export const denkmaelerWfServiceIntern = {
  id: denkmaelerWfsIntern,
  name: 'Denkmäler (WFS)',
  typ: 'WFS',
  version: '2.0.0',
  transparent: true,
  featureType: 'app:TBLGIS_ORA',
  url: '#{Project.internalHost.URL}/wfs',
}
const denkmaelerWmServiceIntern = {
  id: denkmaelerWmsIntern,
  name: 'Denkmäler (WMS)',
  typ: 'WMS',
  layers: '6,24,25,4,3,2,1,0',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  url: '#{Project.internalHost.URL}/wms',
}
const beschriftungService = {
  id: beschriftung,
  name: 'Beschriftung',
  typ: 'WMS',
  layers: '9,10,11,12,13,15,16,17,26,27,35,36,34,33,32,31,30',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  url: '#{Project.internalHost.URL}/wms',
}

const kontrollbedarfServiceIntern = {
  id: kontrollbedarfIntern,
  name: 'Objekte mit Kontrollbedarf (WMS)',
  typ: 'WMS',
  layers: '28,29,23,22,21,20,19',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  url: '#{Project.internalHost.URL}/wms',
}
const verlustServiceIntern = {
  id: verlustIntern,
  name: 'Verlust',
  typ: 'WMS',
  layers: '7,8',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  url: '#{Project.internalHost.URL}/wms',
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
  beschriftungService,
  verwaltungsGrenzenService,
  bddEinInternService,
  bddColInternService,
  aerialPhotoService,
]
