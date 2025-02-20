import { makeStoreModule } from '../../store'

describe('parseResponse', () => {
  const RoutingStore = makeStoreModule()
  const parseResponse = RoutingStore.actions?.parseResponse as (
    context: any,
    text: string
  ) => { features: any[] }

  if (typeof parseResponse === 'undefined') {
    throw new Error('Actions missing in RoutingStore. Tests could not be run.')
  }

  it('should parse a valid WFS XML response correctly', () => {
    const xmlResponse = `
          <wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs"
                                xmlns:dog="http://example.com/dog"
                                xmlns:gml="http://www.opengis.net/gml">
            <wfs:member>
              <dog:Strassen>
                <dog:strassenname>Hauptstraße</dog:strassenname>
                <dog:ortsteilname>Altstadt</dog:ortsteilname>
                <gml:pos>10.0 50.0</gml:pos>
                <gml:posList>10.0 50.0 20.0 60.0</gml:posList>
                <dog:hausnummer>1</dog:hausnummer>
                <dog:hausnummer>2</dog:hausnummer>
              </dog:Strassen>
            </wfs:member>
          </wfs:FeatureCollection>`

    const result = parseResponse({}, xmlResponse)

    expect(result.features).toHaveLength(1)
    expect(result.features[0]).toEqual({
      strassenname: 'Hauptstraße',
      ortsteilname: 'Altstadt',
      position: [10.0, 50.0],
      boundingPolygon: [10.0, 50.0, 20.0, 60.0],
      hausnummern: ['1', '2'],
    })
  })

  it('should return an empty array for an empty response', () => {
    const xmlResponse = `<wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs"/>`
    const result = parseResponse({}, xmlResponse)

    expect(result.features).toEqual([])
  })

  it('should handle missing elements gracefully', () => {
    const xmlResponse = `
          <wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs"
              xmlns:dog="http://example.com/dog"
                xmlns:gml="http://www.opengis.net/gml">
            <wfs:member>
              <dog:Strassen>
                <dog:strassenname>Unbekannte Straße</dog:strassenname>
              </dog:Strassen>
            </wfs:member>
          </wfs:FeatureCollection>`

    const result = parseResponse({}, xmlResponse)

    expect(result.features).toHaveLength(1)
    expect(result.features[0]).toEqual({
      strassenname: 'Unbekannte Straße',
      ortsteilname: 'Unbekannt', // Default-Wert
      position: null,
      boundingPolygon: null,
      hausnummern: [],
    })
  })

  it('should catche parsing errors and return an empty array', () => {
    const invalidXml = `<invalid<xml`
    const result = parseResponse({}, invalidXml)

    expect(result.features).toEqual([])
  })
})

describe('parseResponseHausnummern', () => {
  const RoutingStore = makeStoreModule()
  const parseResponseHausnummern = RoutingStore.actions
    ?.parseResponseHausnummern as (
    context: any,
    responseText: string
  ) => { features: any[] }

  if (typeof parseResponseHausnummern === 'undefined') {
    throw new Error('Actions missing in RoutingStore. Tests could not be run.')
  }

  it('should parse a valid house number response correctly', () => {
    const xmlResponse = `
        <wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs"
                              xmlns:gages="http://example.com/gages"
                              xmlns:dog="http://example.com/dog"
                              xmlns:iso19112="http://example.com/iso19112"
                              xmlns:gml="http://www.opengis.net/gml">
          <wfs:member>
            <gages:Hauskoordinaten>
              <dog:hausnummer>10</dog:hausnummer>
              <dog:hausnummernzusatz>A</dog:hausnummernzusatz>
              <iso19112:geographicIdentifier>Berlin Mitte</iso19112:geographicIdentifier>
              <gml:pos>13.405 52.52</gml:pos>
              <gml:posList>13.405 52.52 13.406 52.521</gml:posList>
            </gages:Hauskoordinaten>
          </wfs:member>
        </wfs:FeatureCollection>`

    const result = parseResponseHausnummern({}, xmlResponse)

    expect(result.features).toHaveLength(1)
    expect(result.features[0]).toEqual({
      hausnummer: '10',
      hausnummerZusatz: 'A',
      geographicIdentifier: 'Berlin Mitte',
      position: [13.405, 52.52],
      boundingPolygon: [13.405, 52.52, 13.406, 52.521],
    })
  })

  it('should return an empty array for an empty response', () => {
    const xmlResponse = `<wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs"/>`
    const result = parseResponseHausnummern({}, xmlResponse)

    expect(result.features).toEqual([])
  })

  it('should handle missing elements gracefully', () => {
    const xmlResponse = `
        <wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs"
                              xmlns:gages="http://example.com/gages"
                              xmlns:dog="http://example.com/dog"
                              xmlns:iso19112="http://example.com/iso19112"
                              xmlns:gml="http://www.opengis.net/gml">
          <wfs:member>
            <gages:Hauskoordinaten>
              <dog:hausnummer>15</dog:hausnummer>
            </gages:Hauskoordinaten>
          </wfs:member>
        </wfs:FeatureCollection>`

    const result = parseResponseHausnummern({}, xmlResponse)

    expect(result.features).toHaveLength(1)
    expect(result.features[0]).toEqual({
      hausnummer: '15',
      hausnummerZusatz: '', // Default-Wert
      geographicIdentifier: '', // Default-Wert
      position: [], // Kein <gml:pos>
      boundingPolygon: [], // Kein <gml:posList>
    })
  })

  it('should catch parsing errors and return an empty array', () => {
    const invalidXml = `<invalid<xml`
    const result = parseResponseHausnummern({}, invalidXml)

    expect(result.features).toEqual([])
  })
})
