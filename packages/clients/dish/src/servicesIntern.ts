import {
  bddCol,
  bddEin,
  beschriftung,
  denkmaelerWFS,
  denkmaelerWMS,
  dop20col,
  intranetUrl,
  kontrollbedarf,
  verlust,
  verwaltung,
} from './servicesConstants'

// services with url=null: those will be set in the services.ts

const commonConfigDenkmaelWMS = {
  url: null,
  typ: 'WMS',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  singleTile: true,
}

const denkmaelerWmService = {
  ...commonConfigDenkmaelWMS,
  id: denkmaelerWMS,
  name: 'Denkmäler (WMS)',
  layers: '0,1,2,3,4,6,24,25',
}

const beschriftungService = {
  ...commonConfigDenkmaelWMS,
  id: beschriftung,
  name: 'Beschriftung',
  layers: '9,10,11,12,13,15,16,17,26,27,35,36,34,33,32,31,30',
}

const kontrollbedarfService = {
  ...commonConfigDenkmaelWMS,
  id: kontrollbedarf,
  name: 'Objekte mit Kontrollbedarf (WMS)',
  layers: '19,20,21,22,23,28,29',
}

const verlustService = {
  ...commonConfigDenkmaelWMS,
  id: verlust,
  name: 'Verlust',
  layers: '7,8',
}

export const denkmaelerWfService = {
  id: denkmaelerWFS,
  name: 'Denkmäler (WFS)',
  url: null,
  typ: 'WFS',
  version: '2.0.0',
  transparent: true,
  featureType: 'app:TBLGIS_ORA',
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
  id: bddEin,
  name: 'Grundkarte Graustufen',
  url: `${intranetUrl}/WMS_SH_BDDein_v2`,
  typ: 'WMS',
  layers: 'UEK1500,UEK1000,UEK250,DTK100ein,DTK50ein,DTK25ein,DTK5ein',
  format: 'image/png',
  version: '1.1.1',
  transparent: true,
}

const bddColInternService = {
  id: bddCol,
  name: 'Grundkarte Farbe',
  url: `${intranetUrl}/WMS_SH_BDDcol_v2`,
  typ: 'WMS',
  layers: 'UEK1500,UEK1000,UEK250,DTK100col,DTK50col,DTK25col,DTK5col',
  format: 'image/png',
  version: '1.1.1',
  transparent: true,
}

const dop20ColInternService = {
  id: dop20col,
  name: 'Luftbilder Farbe',
  url: `${intranetUrl}/WMS_SH_DOP20col`,
  typ: 'WMS',
  layers: 'SH_DOP20_4,SH_DOP20_3,SH_DOP20_2,SH_DOP20_1',
  format: 'image/png',
  version: '1.1.1',
  transparent: true,
}

export const servicesIntern = [
  denkmaelerWfService,
  denkmaelerWmService,
  kontrollbedarfService,
  verlustService,
  beschriftungService,
  verwaltungsGrenzenService,
  bddEinInternService,
  bddColInternService,
  dop20ColInternService,
]
