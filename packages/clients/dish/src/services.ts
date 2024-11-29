import { MODE } from './enums'

import { servicesIntern } from './servicesIntern'

export const basemapGrau = 'basemapGrau'
export const denkmaelerWfsExtern = 'denkmaelerWfsExtern'
export const denkmaelerWMS = 'denkmaelerWMS'
export const alkisWfs = 'alkisWfs'
export const alkisWms = 'alkisWms'
export const dop20col = 'dop20col'
export const dop20sw = 'dop20sw'
export const bddCol = 'bddCol'
export const bddEin = 'bddEin'

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
  id: denkmaelerWfsExtern,
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

const servicesExtern = [
  denkmaelerWmService,
  denkmaelerWfServiceExtern,
  dop20ColService,
  dop20swService,
  bddColService,
  bddEinService,
]

const alkisWfService = {
  id: alkisWfs,
  name: 'ALKIS',
  url: `${dishCloudBaseUrl}/dish/bkg/ALKIS_WFS`,
  typ: 'WFS',
  version: '2.0.0',
  transparent: true,
  featureType: 'ave:Flurstueck',
}

const alkisWmService = {
  id: alkisWms,
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

const servicesCommon = [basemapGrauService, alkisWfService, alkisWmService]

export const services = (mode: keyof typeof MODE, urlParams) => {
  if (mode === MODE.EXTERN) {
    return [...servicesCommon, ...servicesExtern]
  }
  // set urls that need to be configurable
  const denkmaelerWmsInternUrl = `${urlParams.internServicesBaseUrl}/wms`

  const servicesUrls = {
    denkmaelerWfsInternUrl: `${urlParams.internServicesBaseUrl}/wfs`,
    denkmaelerWmsInternUrl,
    beschriftungUrl: denkmaelerWmsInternUrl,
    kontrollbedarfInternUrl: denkmaelerWmsInternUrl,
    verlustInternUrl: denkmaelerWmsInternUrl,
  }

  const internServicesWithUrls = servicesIntern.map((service) => ({
    ...service,
    url: servicesUrls[`${service.id}Url`],
  }))

  return [...servicesCommon, ...internServicesWithUrls]
}
