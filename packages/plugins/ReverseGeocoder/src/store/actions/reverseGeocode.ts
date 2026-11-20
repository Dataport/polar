import mapValues from 'lodash.mapvalues'
import xml2js from 'xml2js'
import { PolarActionContext } from '@polar/lib-custom-types'
import { ReverseGeocoderFeature } from '../../types'

const { parseString, processors } = xml2js

/* eslint-disable @typescript-eslint/naming-convention */
interface WpsExceptionReport {
  Exception?: Array<{ ExceptionText?: string[] }>
}

interface ParsedWpsResponse {
  ExceptionReport?: WpsExceptionReport
  ExecuteResponse?: {
    ProcessOutputs?: Array<{
      Output?: Array<{
        Data?: Array<{
          ComplexData?: Array<{
            ReverseGeocoder?: Array<{
              Ergebnis?: Array<{ Adresse?: Array<Record<string, string[]>> }>
            }>
          }>
        }>
      }>
    }>
    Status?: Array<{
      ProcessFailed?: Array<{
        ExceptionReport?: WpsExceptionReport[]
      }>
    }>
  }
}
/* eslint-enable @typescript-eslint/naming-convention */

const buildPostBody = ([x, y]: [number, number]) => `
  <wps:Execute xmlns:wps='http://www.opengis.net/wps/1.0.0' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ows='http://www.opengis.net/ows/1.1' service='WPS' version='1.0.0' xsi:schemaLocation='http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsExecute_request.xsd'>
    <ows:Identifier>ReverseGeocoder.fmw</ows:Identifier>
      <wps:DataInputs>
        <wps:Input>
          <ows:Identifier>X</ows:Identifier>
          <wps:Data>
            <wps:LiteralData dataType='float'>${x}</wps:LiteralData>
          </wps:Data>
        </wps:Input>
        <wps:Input>
        <ows:Identifier>Y</ows:Identifier>
        <wps:Data>
          <wps:LiteralData dataType='float'>${y}</wps:LiteralData>
        </wps:Data>
      </wps:Input>
    </wps:DataInputs>
  </wps:Execute>
`

const readResponseText = (xmlString: string): Promise<object> =>
  new Promise((resolve, reject) =>
    parseString(
      xmlString,
      { tagNameProcessors: [processors.stripPrefix] },
      (err, source) => (err ? reject(err) : resolve(source))
    )
  )

export async function reverseGeocode(
  {
    rootGetters: { configuration },
  }: PolarActionContext<Record<string, never>, Record<string, never>>,
  coordinate: [number, number]
): Promise<ReverseGeocoderFeature> {
  const url = configuration.reverseGeocoder?.url

  if (!url) {
    throw new Error('POLAR ReverseGeocoder#reverseGeocode: No URL specified.')
  }

  const response = await fetch(url, {
    method: 'POST',
    body: buildPostBody(coordinate),
  })

  const parsedBody = (await readResponseText(
    await response.text()
  )) as ParsedWpsResponse

  const addressOutput =
    parsedBody.ExecuteResponse?.ProcessOutputs?.[0]?.Output?.[0]?.Data?.[0]
      ?.ComplexData?.[0]?.ReverseGeocoder?.[0]?.Ergebnis?.[0]?.Adresse?.[0]

  if (!addressOutput) {
    const exceptionText =
      parsedBody.ExceptionReport?.Exception?.[0]?.ExceptionText?.[0] ??
      parsedBody.ExecuteResponse?.Status?.[0]?.ProcessFailed?.[0]
        ?.ExceptionReport?.[0]?.Exception?.[0]?.ExceptionText?.[0]
    throw new Error(
      exceptionText ??
        'WPS response did not contain a ReverseGeocoder address output.'
    )
  }

  const address = mapValues(addressOutput, (v) => v[0])
  // NOTE: Property names come from the WPS
  /* eslint-disable @typescript-eslint/naming-convention */
  const properties = {
    Distanz: parseFloat(address.Distanz),
    Hausnr: parseInt(address.Hausnr, 10),
    Plz: parseInt(address.Plz, 10),
    Strasse: address.Strasse,
    XKoordinate: parseFloat(address.XKoordinate),
    YKoordinate: parseFloat(address.YKoordinate),
    Zusatz: address.Zusatz,
  }
  /* eslint-enable @typescript-eslint/naming-convention */

  return {
    type: 'reverse_geocoded',
    title: `${properties.Strasse} ${properties.Hausnr}${properties.Zusatz}`,
    properties,
    geometry: {
      // as clicked by user - usually want to keep this since user is pointing at something
      coordinates: coordinate,
      type: 'Point',
    },
    addressGeometry: {
      // as returned by reverse geocoder
      coordinates: [properties.XKoordinate, properties.YKoordinate],
      type: 'Point',
    },
  }
}
