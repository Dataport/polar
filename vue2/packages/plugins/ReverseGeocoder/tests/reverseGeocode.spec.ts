/* eslint-disable @typescript-eslint/ban-ts-comment */
import { reverseGeocode } from '../src/utils/reverseGeocode'

const testUrl = 'www.example.com/WPS'

const testCoordinates: [number, number] = [565192.2974622496, 5933428.820743558]

const wpsExpectedBody = `
  <wps:Execute xmlns:wps='http://www.opengis.net/wps/1.0.0' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ows='http://www.opengis.net/ows/1.1' service='WPS' version='1.0.0' xsi:schemaLocation='http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsExecute_request.xsd'>
    <ows:Identifier>ReverseGeocoder.fmw</ows:Identifier>
      <wps:DataInputs>
        <wps:Input>
          <ows:Identifier>X</ows:Identifier>
          <wps:Data>
            <wps:LiteralData dataType='float'>${testCoordinates[0]}</wps:LiteralData>
          </wps:Data>
        </wps:Input>
        <wps:Input>
        <ows:Identifier>Y</ows:Identifier>
        <wps:Data>
          <wps:LiteralData dataType='float'>${testCoordinates[1]}</wps:LiteralData>
        </wps:Data>
      </wps:Input>
    </wps:DataInputs>
  </wps:Execute>
`

const wpsMockResponse = `<?xml version='1.0' encoding='UTF-8'?>
<wps:ExecuteResponse xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" service="WPS" version="1.0.0" xml:lang="en" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsExecute_response.xsd" serviceInstance="https://geodienste.hamburg.de/HH_WPS?service=WPS&amp;request=GetCapabilities&amp;version=1.0.0">
  <wps:Process wps:processVersion="0.0.1">
    <ows:Identifier>ReverseGeocoder.fmw</ows:Identifier>
    <ows:Title>ReverseGeocoder</ows:Title>
    <ows:Abstract>&lt;p style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;">prio: normal&lt;/p> &lt;p style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;">kritisch: nein&lt;/p> &lt;p style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;">Ansprechpartner: webdienste@gv.hamburg.de&lt;/p> &lt;p style="-qt-paragraph-type:empty; margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;">     &lt;br/> &lt;/p> &lt;p style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;">Beschreibung: startet mit einem Punkt und findet dazu die nächst gelegene Adresse und ermittelt die Zuständigkeit&lt;/p> &lt;p style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;">das Ergebnis wird zurückgegeben&lt;/p> </ows:Abstract>
  </wps:Process>
  <wps:Status creationTime="2023-10-13T07:54:26.579Z">
    <wps:ProcessSucceeded>Process execution finished@2023-10-13T07:54:26.579Z</wps:ProcessSucceeded>
  </wps:Status>
  <wps:ProcessOutputs>
    <wps:Output>
      <ows:Identifier>FMEResponse</ows:Identifier>
      <ows:Title>Response from FME (Job Submitter Service)</ows:Title>
      <wps:Data>
        <wps:ComplexData mimeType="application/xml">
          <wps:ReverseGeocoder xmlns:wps="http://www.safe.com/xml/xmltables" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.safe.com/xml/xmltables output.xsd">
            <wps:Anfrage>
              <wps:XKoordinate>${testCoordinates[0]}</wps:XKoordinate>
              <wps:YKoordinate>${testCoordinates[1]}</wps:YKoordinate>
              <wps:Epsg>25832</wps:Epsg>
            </wps:Anfrage>
            <wps:Ergebnis>
              <wps:Adresse>
                <wps:Strasse>Herrlichkeit</wps:Strasse>
                <wps:Hausnr>1</wps:Hausnr>
                <wps:Zusatz/>
                <wps:Plz>20459</wps:Plz>
                <wps:Distanz>16.20141565450446</wps:Distanz>
                <wps:XKoordinate>565200.347</wps:XKoordinate>
                <wps:YKoordinate>5933442.881</wps:YKoordinate>
              </wps:Adresse>
            </wps:Ergebnis>
          </wps:ReverseGeocoder>
        </wps:ComplexData>
      </wps:Data>
    </wps:Output>
  </wps:ProcessOutputs>
</wps:ExecuteResponse>`

describe('plugin-reversegeocoder', () => {
  describe('utils', () => {
    describe('resolve', () => {
      let fetch
      beforeEach(() => {
        fetch = global.fetch
        // @ts-ignore | it's a mock
        global.fetch = jest.fn(() =>
          Promise.resolve({
            text: () => Promise.resolve(wpsMockResponse),
          })
        )
      })
      afterEach(() => {
        global.fetch = fetch
      })
      it('fetches with the appropriate body', () => {
        reverseGeocode(testUrl, testCoordinates)

        // @ts-ignore | it's a mock
        const calls: Array = global.fetch.mock.calls
        expect(calls.length).toBe(1)
        expect(calls[0]).toEqual([
          testUrl,
          {
            method: 'POST',
            body: wpsExpectedBody,
          },
        ])
      })
      it('reformats the return values correctly', async () => {
        const feature = await reverseGeocode(testUrl, testCoordinates)

        expect(feature).toEqual({
          type: 'reverse_geocoded',
          title: 'Herrlichkeit 1',
          addressGeometry: {
            coordinates: [565200.347, 5933442.881],
            type: 'Point',
          },
          geometry: {
            coordinates: [565192.2974622496, 5933428.820743558],
            type: 'Point',
          },
          properties: {
            /* eslint-disable @typescript-eslint/naming-convention */
            Distanz: 16.20141565450446,
            Hausnr: 1,
            Plz: 20459,
            Strasse: 'Herrlichkeit',
            XKoordinate: 565200.347,
            YKoordinate: 5933442.881,
            Zusatz: '',
            /* eslint-enable @typescript-eslint/naming-convention */
          },
        })
      })
    })
  })
})
