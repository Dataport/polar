import WFS from 'ol/format/WFS'
import GML32 from 'ol/format/GML32'
import GML3 from 'ol/format/GML3'
import GML2 from 'ol/format/GML2'
import GML from 'ol/format/GML'
import { GeoJSON } from 'ol/format'
import { Feature } from 'ol'
import { Feature as GeoJsonFeature } from 'geojson'
import Geometry from 'ol/geom/Geometry'
import TileSource from 'ol/source/Tile'
import { TileWMS } from 'ol/source'
import { RequestGfiParameters, RequestGfiWmsParameters } from '../types'

// list of supported reply formats that can be used from OL
const formats = {
  GML,
  GML2,
  GML3,
  GML32,
}

/**
 * This is a custom text response reader working on an unspecified format that
 * commonly occurs in WMS GFI replies. It can be used by specifying "text" as
 * "format" on a GFI specification. Please mind that it's written from
 * experience, not from a clear definition, and may need attention whenever
 * new cases arise.
 * @param text - Custom text response, hopefully in the implemented format
 * @returns array of OpenLayers features
 */
function readTextFeatures(text: string): Feature<Geometry>[] {
  const lines = text.split('\n')
  const features: Feature<Geometry>[] = []
  let feature: Feature<Geometry> | undefined

  /* TODO: Format supposedly looks like this – is this a standard or arbitrary?
      GetFeatureInfo results:
        LayerName:
          FeatureId:
            Horse: Yes
            Speed: Fast
            Horsepower: 4
  */

  for (const line of lines) {
    if (
      line === '' ||
      line.startsWith('GetFeatureInfo results') ||
      line.startsWith('Layer')
    ) {
      continue
    }
    if (line.startsWith('    ')) {
      if (typeof feature !== 'undefined') {
        const equalIndex = line.indexOf('=')
        const [key, value] = [
          line.substring(0, equalIndex),
          line.substring(equalIndex + 3, line.length - 1),
        ].map((s) => s.trim())
        feature.set(key, value)
      } else {
        console.error(
          '@polar/plugin-gfi: Found property before feature declaration in readTextFeatures.',
          line,
          'Skipping ...'
        )
      }
      continue
    }
    if (line.startsWith('  ')) {
      if (line.includes('Search returned no results')) {
        break
      }
      const id = line.substring(0, line.length - 2).trim()
      feature = new Feature()
      feature.setId(id)
      features.push(feature)
    }
  }

  return features
}

/**
 * In case the layer configuration does not specify a parser, we're trying to
 * detect the returned XML format by searching for a GML namespace. Any return
 * format outside GML will currently not work with this automated parsing.
 * @param data - data as parsed from response body
 * @returns WFS capable of parsing data
 */
function getParserFromData(data: string): WFS {
  // NOTE: Tested for GML32 and GML, may break on GML2/GML3
  const GMLFormat = data.includes('xmlns:gml="http://www.opengis.net/gml/3.2"')
    ? GML32
    : data.includes('xmlns:gml="http://www.opengis.net/gml"')
    ? GML
    : data.includes('xmlns:gml="http://www.opengis.net/gml/2')
    ? GML2
    : GML3

  return new WFS({
    gmlFormat: new GMLFormat(),
  })
}

/**
 * A layer may have its parser specified in the configuration. In this case,
 * the specified parser is retrieved from a list of supported GML parsers, or a
 * custom text parser is used in case it fits.
 * @param format - format as specified by mapConfiguration
 * @returns object that supplies 'readTextFeatures' method
 */
function getParserFromFormat(format: string): Pick<WFS, 'readFeatures'> {
  if (formats[format]) {
    return new WFS({
      gmlFormat: new formats[format](),
    })
  }

  if (format === 'text') {
    return {
      readFeatures: readTextFeatures,
    }
  }

  throw new Error(`Format '${format}' not yet implemented in requestGfiWms.ts.`)
}

/**
 * @param parameters - map, layer, and coordinate to use for GFI request
 * @returns url to request for feature information
 */
function getWmsGfiUrl(
  { map, layer, coordinate }: RequestGfiWmsParameters,
  { infoFormat }: Record<string, unknown>
): string {
  // Only layers with a valid source reach this point
  const source = layer.getSource() as TileWMS
  const view = map.getView()
  const url = source.getFeatureInfoUrl(
    coordinate,
    // The view always has a resolution if this function is called
    view.getResolution() as number,
    view.getProjection(),
    {
      feature_count: 10,
    }
  )
  const suffix = infoFormat ? `&info_format=${infoFormat}` : ''
  return url + suffix
}

/**
 * Method fetches WMS feature information. Result will be filtered and modified
 * according to layerConfiguration.
 * @param parameters - parameter object
 * @returns promise of all features that hold relevant feature information
 */
export default (
  parameters: RequestGfiWmsParameters
): Promise<GeoJsonFeature[]> => {
  const { coordinate, layerConfiguration, layerSpecification } = parameters
  const { filterBy, geometryName, format } = layerConfiguration

  const url = getWmsGfiUrl(parameters, layerSpecification)

  return fetch(url)
    .then((response) => response.text())
    .then((data) => {
      /* NOTE: test block for WMS GFI
      import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo'
      try {
        console.error('WMS GFI', url)
        console.error(new WMSGetFeatureInfo().readFeatures(data))
      } catch (e) {
        console.error(e)
      }
      */

      const parser =
        layerSpecification.infoFormat === 'application/geojson'
          ? new GeoJSON()
          : format
          ? getParserFromFormat(format)
          : getParserFromData(data)

      const parsedFeatures: Feature<Geometry>[] = parser.readFeatures(data)
      const writer = new GeoJSON()

      if (geometryName) {
        parsedFeatures.forEach((f) => f.setGeometryName('geometry'))
      }

      const jsonFeatures = parsedFeatures
        // WMS may return features nearby - filter to hit features
        .filter((feature) =>
          filterBy === 'clickPosition'
            ? feature.getGeometry()?.intersectsCoordinate(coordinate)
            : true
        )
        // transform to jsonable object representation
        .map((f) => JSON.parse(writer.writeFeature(f)))

      return jsonFeatures
    })
    .catch((e) => Promise.reject(e))
}
