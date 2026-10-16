import { getInspireCadastralParcels } from '../inspireCadastralParcel'
import { parseInput } from '../inspireCadastralParcel/parseInput'
import {
  buildRequest,
  districtFilter,
  escapeXml,
  parcelFilter,
  resourceIds,
} from '../inspireCadastralParcel/buildRequests'

const geometry = `<cp:geometry><gml:Polygon srsName="http://www.opengis.net/def/crs/EPSG/0/25832" srsDimension="2"><gml:exterior><gml:LinearRing><gml:posList>500000 6000000 500010 6000000 500010 6000010 500000 6000000</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon></cp:geometry><cp:referencePoint><gml:Point srsName="http://www.opengis.net/def/crs/EPSG/0/25832" srsDimension="2"><gml:pos>500005 6000005</gml:pos></gml:Point></cp:referencePoint>`

const zoning = (
  reference = '016137',
  name = 'Preetz',
  level = 'Gemarkung'
) => `<wfs:member><cp:CadastralZoning gml:id="CadastralZoning_${reference}">
${geometry}
<cp:label>${reference.substring(2)}</cp:label>
<cp:levelName><gmd:LocalisedCharacterString>${level}</gmd:LocalisedCharacterString></cp:levelName>
<cp:name><gn:GeographicalName><gn:spelling><gn:SpellingOfName><gn:text>${escapeXml(
  name
)}</gn:text></gn:SpellingOfName></gn:spelling></gn:GeographicalName></cp:name>
<cp:nationalCadastalZoningReference>${reference}</cp:nationalCadastalZoningReference>
</cp:CadastralZoning></wfs:member>`

const parcel = (
  reference = '016137006000140004__',
  label = '14/4'
) => `<wfs:member><cp:CadastralParcel gml:id="CadastralParcel_${reference}">
${geometry}
<cp:label>${label}</cp:label><cp:areaValue uom="m2">461</cp:areaValue>
<cp:nationalCadastralReference>${reference}</cp:nationalCadastralReference>
</cp:CadastralParcel></wfs:member>`

const collection = (members: string) =>
  `<wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs/2.0" xmlns:cp="http://inspire.ec.europa.eu/schemas/cp/4.0" xmlns:gml="http://www.opengis.net/gml/3.2" xmlns:gn="http://inspire.ec.europa.eu/schemas/gn/4.0" xmlns:gmd="http://www.isotc211.org/2005/gmd">${members}</wfs:FeatureCollection>`

describe('INSPIRE cadastral inputs', () => {
  it.each([
    ['123', { kind: 'parcel', zaehler: '123' }],
    ['14/4', { kind: 'parcel', zaehler: '14', nenner: '4' }],
    ['14/', { kind: 'parcel', zaehler: '14', nennerOpen: true }],
    ['Preetz 6', { kind: 'parcel', gemarkungName: 'Preetz', zaehler: '6' }],
    [
      'Preetz 14/4',
      { kind: 'parcel', gemarkungName: 'Preetz', zaehler: '14', nenner: '4' },
    ],
    [
      'Preetz 6 14/4',
      { kind: 'parcel', gemarkungName: 'Preetz', flur: '6', zaehler: '14' },
    ],
    [
      'Preetz, Flur 6, 14/4',
      { kind: 'parcel', gemarkungName: 'Preetz', flur: '6', nenner: '4' },
    ],
    ['Preetz', { kind: 'zoning', gemarkungName: 'Preetz' }],
    ['Preetz Flur 6', { kind: 'zoning', gemarkungName: 'Preetz', flur: '6' }],
    ['Aasb\u00fcttel', { kind: 'zoning', gemarkungName: 'Aasb\u00fcttel' }],
    ['016137', { kind: 'kennzeichen', reference: '016137' }],
    [
      '016137006000140004__',
      { kind: 'kennzeichen', reference: '016137006000140004__' },
    ],
    [
      'Gemarkung Preetz (6137), Flur 6, Flurst\u00fcck 14/4',
      {
        kind: 'parcel',
        gemarkungName: 'Preetz',
        gemarkungNumber: '6137',
        flur: '6',
        zaehler: '14',
        nenner: '4',
      },
    ],
    [
      'Gemarkung Preetz (6137)',
      { kind: 'zoning', gemarkungName: 'Preetz', gemarkungNumber: '6137' },
    ],
  ])('parses %s', (input, expected) => {
    expect(parseInput(input)[0]).toMatchObject(expected)
  })

  it.each([
    '',
    'Preetz Flur 6 nope',
    'Preetz 1/2/3',
    '*',
    '123456789012345678901',
  ])('rejects invalid input %s explicitly', (input) =>
    expect(() => parseInput(input)).toThrow()
  )
})

describe('INSPIRE cadastral requests', () => {
  it('builds well-formed WFS 2.0.0 XML with namespaces and limits', () => {
    const xml = buildRequest(
      'CadastralParcel',
      parcelFilter(parseInput('123')[0], []),
      20,
      'EPSG:25832'
    )
    expect(
      new DOMParser()
        .parseFromString(xml, 'application/xml')
        .getElementsByTagName('parsererror')
    ).toHaveLength(0)
    expect(xml).toContain('version="2.0.0" count="20"')
    expect(xml).toContain('typeNames="cp:CadastralParcel"')
    expect(xml).toContain('srsName="EPSG:25832"')
    expect(xml).toContain('<fes:Literal>123</fes:Literal>')
    expect(xml).toContain('<fes:Literal>123/*</fes:Literal>')
    expect(xml).not.toContain('<fes:Literal>123*</fes:Literal>')
  })

  it('uses exact denominators and supports an open denominator', () => {
    expect(parcelFilter(parseInput('14/4')[0], [])).toContain(
      '<fes:Literal>14/4</fes:Literal>'
    )
    expect(parcelFilter(parseInput('14/')[0], [])).not.toContain(
      '<fes:PropertyIsEqualTo>'
    )
  })

  it('combines same-name districts and pads flur and parcel numbers', () => {
    const filter = parcelFilter(parseInput('Preetz 6 14/4')[0], [
      '016137',
      '019999',
    ])
    expect(filter).toContain('<fes:Or>')
    expect(filter).toContain('<fes:Literal>016137006000140004*</fes:Literal>')
    expect(filter).toContain('<fes:Literal>019999006000140004*</fes:Literal>')
    expect(parcelFilter(parseInput('Preetz 14/4')[0], ['016137'])).toContain(
      '016137...000140004*'
    )
  })

  it('filters names case-insensitively and restricts selected district numbers', () => {
    const filter = districtFilter(
      parseInput('Gemarkung Aasb\u00fcttel (0001)')[0]
    )
    expect(filter).toContain('matchCase="false"')
    expect(filter).toContain('gn:SpellingOfName/gn:text')
    expect(filter).toContain('Aasb\u00fcttel*')
    expect(filter).toContain('..0001')
  })

  it('escapes XML values and supports identifier prefixes and resource IDs', () => {
    expect(districtFilter(parseInput('Alt & Neu')[0])).toContain(
      'Alt &amp; Neu*'
    )
    expect(parcelFilter(parseInput('016137')[0], [])).toContain(
      '<fes:Literal>016137*</fes:Literal>'
    )
    expect(resourceIds(['016137', '016137006'])).toBe(
      '<fes:ResourceId rid="CadastralZoning_016137"/><fes:ResourceId rid="CadastralZoning_016137006"/>'
    )
  })
})

describe('getInspireCadastralParcels', () => {
  const originalFetch = global.fetch
  let fetchMock: jest.Mock
  let url: string
  let sequence = 0

  const respond = (xml: string) => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(xml),
      clone: () => ({ text: () => Promise.resolve(xml) }),
    })
  }
  const body = (index: number): string => fetchMock.mock.calls[index][1].body

  beforeEach(() => {
    fetchMock = jest.fn()
    global.fetch = fetchMock
    url = `https://example.test/cadastral/${sequence++}`
  })
  afterAll(() => {
    global.fetch = originalFetch
  })

  it('resolves names, retains geometry and properties, sorts and caches per URL', async () => {
    const parcels = collection(parcel('016137010000140004__') + parcel())
    respond(parcels)
    respond(collection(zoning()))
    const result = await getInspireCadastralParcels(null, url, '14/4')
    expect(result.features).toHaveLength(2)
    expect(result.features[0]).toMatchObject({
      title: 'Gemarkung Preetz (6137), Flur 6, Flurst\u00fcck 14/4',
      epsg: 'EPSG:25832',
      geometry: { type: 'Polygon' },
      properties: {
        label: '14/4',
        areaValue: { uom: 'm2' },
        gemarkung: 'Preetz',
        gemarkungsnummer: '6137',
        flur: '6',
        zaehler: '14',
        nenner: '4',
        flurstueckskennzeichen: '016137006000140004__',
      },
    })
    expect(result.features[0].properties?.areaValue).toHaveProperty(
      '_content_',
      '461'
    )
    expect(body(1)).toContain('rid="CadastralZoning_016137"')
    respond(parcels)
    await getInspireCadastralParcels(null, url, '14/4')
    expect(fetchMock).toHaveBeenCalledTimes(3)
    respond(parcels)
    respond(collection(zoning()))
    await getInspireCadastralParcels(null, `${url}/other`, '14/4')
    expect(fetchMock).toHaveBeenCalledTimes(5)
  })

  it('searches every returned same-name district and passes the signal', async () => {
    respond(collection(zoning() + zoning('019999', 'Preetz')))
    respond(collection(parcel()))
    const signal = new AbortController().signal
    await getInspireCadastralParcels(signal, url, 'Preetz 6 14/4')
    expect(body(1)).toContain('016137006000140004*')
    expect(body(1)).toContain('019999006000140004*')
    expect(
      fetchMock.mock.calls.every(([, options]) => options.signal === signal)
    ).toBe(true)
  })

  it('returns districts as selectable geometry features', async () => {
    respond(collection(zoning()))
    const result = await getInspireCadastralParcels(null, url, 'Preetz')
    expect(result.features[0]).toMatchObject({
      title: 'Gemarkung Preetz (6137)',
      geometry: { type: 'Polygon' },
      properties: { gemarkung: 'Preetz', flur: '', zaehler: '', nenner: '' },
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('returns flur geometry via a ResourceId query', async () => {
    respond(collection(zoning()))
    respond(collection(zoning('016137006', '6', 'GemarkungsteilFlur')))
    const result = await getInspireCadastralParcels(null, url, 'Preetz Flur 6')
    expect(body(1)).toContain('rid="CadastralZoning_016137006"')
    expect(result.features[0]).toMatchObject({
      title: 'Gemarkung Preetz (6137), Flur 6',
      properties: { flur: '6', zaehler: '' },
    })
  })

  it('handles absent denominators and identifier searches', async () => {
    respond(collection(parcel('01613700600123______', '123')))
    respond(collection(zoning()))
    const result = await getInspireCadastralParcels(null, url, '01613700600123')
    expect(result.features[0].properties?.nenner).toBe('')
    expect(result.features[0]).toMatchObject({
      title: 'Gemarkung Preetz (6137), Flur 6, Flurst\u00fcck 123',
    })
  })

  it('does not query parcels when no district matches', async () => {
    respond(collection(''))
    expect(
      (await getInspireCadastralParcels(null, url, 'Unbekannt 14/4')).features
    ).toHaveLength(0)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('applies configurable limits', async () => {
    respond(collection(zoning() + zoning('019999', 'Preetz')))
    const result = await getInspireCadastralParcels(null, url, 'Preetz', {
      maxFeatures: 1,
      maxGemarkungen: 2,
    })
    expect(body(0)).toContain('count="2"')
    expect(result.features).toHaveLength(1)
  })

  it('fails explicitly if a related district is missing', async () => {
    respond(collection(parcel()))
    respond(collection(''))
    await expect(getInspireCadastralParcels(null, url, '14/4')).rejects.toThrow(
      'could not be resolved'
    )
  })

  it('reports WFS exception messages rather than empty success', async () => {
    respond(
      '<ExceptionReport xmlns="http://www.opengis.net/ows/1.1"><Exception><ExceptionText>Invalid property</ExceptionText></Exception></ExceptionReport>'
    )
    await expect(getInspireCadastralParcels(null, url, '123')).rejects.toThrow(
      'Invalid property'
    )
  })

  it('reports HTTP and malformed XML errors', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 503 })
    await expect(getInspireCadastralParcels(null, url, '123')).rejects.toThrow(
      '503'
    )
    respond('<broken')
    await expect(getInspireCadastralParcels(null, url, '123')).rejects.toThrow()
  })

  it('rejects invalid limits before sending a request', async () => {
    await expect(
      getInspireCadastralParcels(null, url, '123', {
        maxFeatures: 0,
      })
    ).rejects.toThrow('positive integer')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('does not request when already aborted', async () => {
    const controller = new AbortController()
    controller.abort()
    await expect(
      getInspireCadastralParcels(controller.signal, url, '123')
    ).rejects.toMatchObject({ name: 'AbortError' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('does not enrich an aborted parcel response', async () => {
    const controller = new AbortController()
    fetchMock.mockImplementationOnce(() => {
      controller.abort()
      return Promise.resolve({
        ok: true,
        clone: () => ({ text: () => Promise.resolve(collection(parcel())) }),
      })
    })
    await expect(
      getInspireCadastralParcels(controller.signal, url, '14/4')
    ).rejects.toMatchObject({ name: 'AbortError' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
