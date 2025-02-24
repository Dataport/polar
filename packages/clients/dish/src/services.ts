import { MODE } from './enums'
import { DishUrlParams } from './types'
import { servicesIntern } from './servicesIntern'
import {
  alkisWfs,
  alkisWms,
  dishDeegreeBaseUrl,
  dishCloudBaseUrl,
  bddEin,
  bddCol,
  dop20col,
  denkmaelerWMS,
  denkmaelerWFS,
  basemapGrau,
  kontrollbedarf,
  verlust,
  beschriftung,
} from './servicesConstants'

export const denkmaelerWmService = {
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

export const denkmaelerWfServiceExtern = {
  id: denkmaelerWFS,
  name: 'Denkmäler (WFS)',
  url: `${dishDeegreeBaseUrl}/wfs_shp`,
  typ: 'WFS',
  version: '2.0.0',
  transparent: true,
  featureType: 'app:dish_shp',
}

const dop20ColService = {
  id: dop20col,
  name: 'DOP 20 (Farbe)',
  url: `${dishCloudBaseUrl}/dishbkgDOP20col`,
  typ: 'WMS',
  layers: 'SH_DOP20_4,SH_DOP20_3,SH_DOP20_2,SH_DOP20_1',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
}

const bddColService = {
  id: bddCol,
  name: 'BDD (Mehrfarbe)',
  url: `${dishCloudBaseUrl}/dishbkgBDDcol`,
  typ: 'WMS',
  layers:
    'DTK5col,DTK25col,DTK50col,DTK100col,Flaechen_250,Linien_250,Flaechen_1000,Linien_1000,Flaechen_1500,Linien_1500',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
}

const bddEinService = {
  id: bddEin,
  name: 'BDD (Einfarbig)',
  url: `${dishCloudBaseUrl}/dishbkgBDDein`,
  typ: 'WMS',
  layers:
    'DTK5ein,DTK25ein,DTK50ein,DTK100ein,Flaechen_250,Linien_250,Flaechen_1000,Linien_1000,Flaechen_1500,Linien_1500',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
}

const servicesExtern = [
  denkmaelerWmService,
  denkmaelerWfServiceExtern,
  dop20ColService,
  bddColService,
  bddEinService,
]

const basemapGrauService = {
  id: basemapGrau,
  name: 'WMS DE BASEMAP.DE WEB RASTER',
  url: 'https://sgx.geodatenzentrum.de/wms_basemapde',
  typ: 'WMS',
  layers: 'de_basemapde_web_raster_grau',
  format: 'image/png',
  version: '1.3.0',
  singleTile: false,
  transparent: true,
}

const alkisWmService = (mode: keyof typeof MODE) => ({
  id: alkisWms,
  name: 'ALKIS WMS',
  url:
    mode === MODE.EXTERN
      ? `${dishCloudBaseUrl}/bkgExtern/ALKIS_FLST`
      : `${dishCloudBaseUrl}/bkg/ALKIS_FLST`,
  typ: 'WMS',
  layers: 'adv_alkis_flurstuecke',
  legendURL: 'ignore',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  singleTile: true,
  STYLES: 'basemapde',
})

export const alkisWfService = (mode: keyof typeof MODE = 'INTERN') => ({
  id: alkisWfs,
  name: 'ALKIS',
  url:
    mode === MODE.EXTERN
      ? `${dishCloudBaseUrl}/dishbkgALKIS_WFS`
      : `${dishCloudBaseUrl}/dishintern_ALKIS_WFS`,
  typ: 'WFS',
  version: '2.0.0',
  transparent: true,
  featureType: 'ave:Flurstueck',
})

const servicesCommon = (mode: keyof typeof MODE) => [
  basemapGrauService,
  alkisWmService(mode),
  alkisWfService(mode),
]

export const services = (mode: keyof typeof MODE, urlParams: DishUrlParams) => {
  if (mode === MODE.EXTERN) {
    return [...servicesCommon(mode), ...servicesExtern]
  }
  // set urls that need to be configurable
  const denkmaelerWmsInternUrl = `${urlParams.internServicesBaseUrl}/wms`

  const servicesUrls = {
    [denkmaelerWFS]: `${urlParams.internServicesBaseUrl}/wfs`,
    [denkmaelerWMS]: denkmaelerWmsInternUrl,
    [beschriftung]: denkmaelerWmsInternUrl,
    [kontrollbedarf]: denkmaelerWmsInternUrl,
    [verlust]: denkmaelerWmsInternUrl,
  }

  const internServicesWithUrls = servicesIntern.map((service) => ({
    ...service,
    url: service.url || servicesUrls[service.id],
  }))

  return [...servicesCommon(mode), ...internServicesWithUrls]
}
