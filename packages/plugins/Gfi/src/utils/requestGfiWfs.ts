import { GeoJSON, WFS } from 'ol/format'
import { Feature as GeoJsonFeature } from 'geojson'
import { RequestGfiParameters } from '../types'

/**
 * Parses WFS reply to jsonable objects.
 * NOTE This method may break on unexpected formats and require further
 * detection. For now, all WFS seem to "behave".
 * @param xmlString - Features as returned by WFS service
 * @param wfsVersion - Version of WFS service
 * @returns features as flat GeoJSON (NOT ol/GeoJSON)
 */
const xml2GeoJson = (
  xmlString: string,
  wfsVersion: string
): GeoJsonFeature[] => {
  const parser = new WFS({ version: wfsVersion })
  const writer = new GeoJSON()
  const features = parser.readFeatures(xmlString)
  const geoJsonFeatures = features.map((f) =>
    JSON.parse(writer.writeFeature(f))
  )

  return geoJsonFeatures
}

/**
 * Executes gfi request on wfs layer and returns result as GeoJSON.
 * NOTE Optimization idea: For layers where features are regularly loaded,
 * no new request should be started. Instead, wait for any running load to
 * finish and use feature at layer source coordinate. (Not trivial.)
 */
// NOTE length comes from string build, not complexity – keep as it is
// eslint-disable-next-line max-lines-per-function
export default ({
  map,
  coordinateOrExtent,
  layerConfiguration,
  layerSpecification,
  mode,
}: Pick<
  RequestGfiParameters,
  | 'map'
  | 'coordinateOrExtent'
  | 'layerConfiguration'
  | 'layerSpecification'
  | 'mode'
>): Promise<GeoJsonFeature[]> => {
  if (coordinateOrExtent.length === 4 && mode !== 'bboxDot') {
    return Promise.reject(
      new Error(
        `Configuration error in requestGfiWfs.ts: mode must be "bboxDot" to be able to use an extent for gfi requests, but was "${mode}".`
      )
    )
  }
  const { featureType, url, version } = layerSpecification
  const { geometryName } = layerConfiguration
  const code = map.getView().getProjection().getCode()
  const typeName = version === '2.0.0' ? 'typeNames' : 'typename'
  let featureUrl = `${url}?service=WFS&version=${version}&request=GetFeature&${typeName}=${featureType}&srsName=${code}`

  if (mode === 'bboxDot') {
    const extent =
      coordinateOrExtent.length === 2
        ? /* The extended extent is necessary because an extent with the same
           * coordinates could lead to an empty featureCollection. */
          [
            coordinateOrExtent[0] - 0.1,
            coordinateOrExtent[1] - 0.1,
            coordinateOrExtent[0] + 0.1,
            coordinateOrExtent[1] + 0.1,
          ]
        : coordinateOrExtent

    featureUrl += `&bbox=${extent},${code}`
  } else if (mode === 'intersects') {
    const point =
      `<gml:Point srsName="${code}">` +
      `<gml:coordinates>${coordinateOrExtent[0]},${coordinateOrExtent[1]}</gml:coordinates>` +
      '</gml:Point>'
    featureUrl +=
      '&FILTER=' +
      // NOTE: fes as a namespace and ValueReference for a property has been introduced in 2.0.0
      (version === '2.0.0'
        ? '<fes:Filter>' +
          '<fes:Intersects>' +
          `<fes:ValueReference>${geometryName}</fes:ValueReference>` +
          point +
          '</fes:Intersects>' +
          '</fes:Filter>'
        : '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">' +
          '<ogc:Intersects>' +
          `<ogc:PropertyName>${geometryName}</ogc:PropertyName>` +
          point +
          '</fes:Intersects>' +
          '</fes:Filter>')
  } else {
    return Promise.reject(
      new Error(
        `Type error in requestGfiWfs.ts: mode must be "intersects" or "bboxDot", but was "${mode}".`
      )
    )
  }

  return (
    fetch(featureUrl, { method: 'GET' })
      .then((response) => response.text())
      // TODO: Type of layerSpecification needs an update to better reflect the possibilities of the services
      //  and get rid of this @ts-ignore
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .then((xmlText) => xml2GeoJson(xmlText, version))
  )
}
