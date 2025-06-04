const isDevMode = process.env.NODE_ENV === 'development'

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

export const intranetUrl = 'https://intranet.gdi-sh.lr.landsh.de'

export const basemapGrau = 'basemapGrau'
export const denkmaelerWFS = 'denkmaelerWFS'
export const denkmaelerWMS = 'denkmaelerWMS'
export const alkisWfs = 'alkisWfs'
export const alkisWms = 'alkisWms'
export const dop20col = 'dop20col'
export const bddCol = 'bddCol'
export const bddEin = 'bddEin'
export const kontrollbedarf = 'kontrollbedarf'
export const verlust = 'verlust'
export const verwaltung = 'verwaltung'
export const beschriftung = 'beschriftung'
