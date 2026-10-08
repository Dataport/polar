import { match, getBlocks } from '../wfs/match'
import { buildWfsFilter } from '../wfs/buildWfsFilter'
import { parseWfsResponse } from '../wfs/parse'

// mock result from pattern.matchAll(/{{(.*?)}}/g) for test comparison
const mockRegExpMatchArray = (find, inner, index, input, groups?) => {
  const regExpMatchArray: RegExpMatchArray = [find, inner]
  regExpMatchArray.index = index
  regExpMatchArray.input = input
  regExpMatchArray.groups = groups
  return regExpMatchArray
}

const patterns = [
  '{{gemarkung}} {{flur}} {{flstnrzae}}/{{flstnrnen}}, {{flstkennz}}',
  '{{gemarkung}} {{flur}} {{flstnrzae}}, {{flstkennz}}',
  '{{gemarkung}} {{flstnrzae}}/{{flstnrnen}}, {{flstkennz}}',
  '{{gemarkung}} {{flstnrzae}}, {{flstkennz}}',
  '{{flstkennz}}',
]

const patternKeys = {
  gemarkung: '([^0-9]+)',
  flur: '([0-9]+)',
  flstnrzae: '([0-9]+)',
  flstnrnen: '([0-9]+)',
  flstkennz: '([0-9_]+)',
}

const parameters = {
  typeName: 'TyPeNaMe',
  featurePrefix: 'prefix',
  xmlns: 'example.com',
  maxFeatures: 999,
  patterns,
  patternKeys,
}

describe('tools/lib/getFeatures/wfs', () => {
  describe('getBlocks', () => {
    it('parts pattern strings to Block[][]', () => {
      expect(getBlocks(patterns[0])).toEqual([
        mockRegExpMatchArray('{{gemarkung}}', 'gemarkung', 0, patterns[0]),
        ' ',
        mockRegExpMatchArray('{{flur}}', 'flur', 14, patterns[0]),
        ' ',
        mockRegExpMatchArray('{{flstnrzae}}', 'flstnrzae', 23, patterns[0]),
        '/',
        mockRegExpMatchArray('{{flstnrnen}}', 'flstnrnen', 37, patterns[0]),
        ', ',
        mockRegExpMatchArray('{{flstkennz}}', 'flstkennz', 52, patterns[0]),
      ])
    })
  })
  describe('match', () => {
    it('builds full match groups', () => {
      const matches = match(
        patterns,
        patternKeys,
        'Musterhausen 12 3/4, 1234___'
      )
      expect(matches).toEqual([
        [
          ['gemarkung', 'Musterhausen'],
          ['flur', '12'],
          ['flstnrzae', '3'],
          ['flstnrnen', '4'],
          ['flstkennz', '1234___'],
        ],
        [
          ['gemarkung', 'Musterhausen'],
          ['flur', '12'],
          ['flstnrzae', '3'],
        ],
        [
          ['gemarkung', 'Musterhausen'],
          ['flstnrzae', '12'],
          ['flstnrnen', '3'],
        ],
        [
          ['gemarkung', 'Musterhausen'],
          ['flstnrzae', '12'],
          ['flstkennz', '3'],
        ],
      ])
    })

    it('manages to decide the best fit', () => {
      const matches = match(patterns, patternKeys, '1234___')
      expect(matches).toEqual([
        [
          ['flur', '1234'],
          ['flstkennz', '___'],
        ],
        [
          ['flstnrzae', '1234'],
          ['flstkennz', '___'],
        ],
        [['flstkennz', '1234___']],
      ])
    })
  })
  describe('buildWfsFilter', () => {
    it('creates an empty search for an empty input', () => {
      const filterXmlString = buildWfsFilter([], parameters)
      expect(filterXmlString).toEqual(
        '<?xml version="1.0" encoding="UTF-8"?><wfs:GetFeature xmlns:wfs="http://www.opengis.net/wfs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" maxFeatures="999"></wfs:GetFeature>'
      )
    })

    it('creates a one-query search for a single match', () => {
      const filterXmlString = buildWfsFilter([[['a', '5']]], parameters)
      expect(filterXmlString).toEqual(
        '<?xml version="1.0" encoding="UTF-8"?><wfs:GetFeature xmlns:wfs="http://www.opengis.net/wfs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" maxFeatures="999"><wfs:Query typeName="prefix:TyPeNaMe" xmlns:prefix="example.com" xmlns:ogc="http://www.opengis.net/ogc"><ogc:Filter><ogc:PropertyIsLike wildCard="*" singleChar="." escapeChar="!"><ogc:PropertyName>prefix:a</ogc:PropertyName><ogc:Literal>5*</ogc:Literal></ogc:PropertyIsLike></ogc:Filter></wfs:Query></wfs:GetFeature>'
      )
    })

    it('creates a one-query and-ed search for a single match with multiple fields', () => {
      const filterXmlString = buildWfsFilter(
        [
          [
            ['a', '5'],
            ['b', '3'],
          ],
        ],
        parameters
      )
      expect(filterXmlString).toEqual(
        '<?xml version="1.0" encoding="UTF-8"?><wfs:GetFeature xmlns:wfs="http://www.opengis.net/wfs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" maxFeatures="999"><wfs:Query typeName="prefix:TyPeNaMe" xmlns:prefix="example.com" xmlns:ogc="http://www.opengis.net/ogc"><ogc:Filter><ogc:And><ogc:PropertyIsLike wildCard="*" singleChar="." escapeChar="!"><ogc:PropertyName>prefix:a</ogc:PropertyName><ogc:Literal>5*</ogc:Literal></ogc:PropertyIsLike><ogc:PropertyIsLike wildCard="*" singleChar="." escapeChar="!"><ogc:PropertyName>prefix:b</ogc:PropertyName><ogc:Literal>3*</ogc:Literal></ogc:PropertyIsLike></ogc:And></ogc:Filter></wfs:Query></wfs:GetFeature>'
      )
    })

    it('creates a multi-query search for a multiple matches', () => {
      const filterXmlString = buildWfsFilter(
        [[['a', '5']], [['b', '3']]],
        parameters
      )
      expect(filterXmlString).toEqual(
        '<?xml version="1.0" encoding="UTF-8"?><wfs:GetFeature xmlns:wfs="http://www.opengis.net/wfs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" maxFeatures="999"><wfs:Query typeName="prefix:TyPeNaMe" xmlns:prefix="example.com" xmlns:ogc="http://www.opengis.net/ogc"><ogc:Filter><ogc:PropertyIsLike wildCard="*" singleChar="." escapeChar="!"><ogc:PropertyName>prefix:a</ogc:PropertyName><ogc:Literal>5*</ogc:Literal></ogc:PropertyIsLike></ogc:Filter></wfs:Query><wfs:Query typeName="prefix:TyPeNaMe" xmlns:prefix="example.com" xmlns:ogc="http://www.opengis.net/ogc"><ogc:Filter><ogc:PropertyIsLike wildCard="*" singleChar="." escapeChar="!"><ogc:PropertyName>prefix:b</ogc:PropertyName><ogc:Literal>3*</ogc:Literal></ogc:PropertyIsLike></ogc:Filter></wfs:Query></wfs:GetFeature>'
      )
    })

    it('creates a WFS 2.0.0 request with FES filters and count', () => {
      const filterXmlString = buildWfsFilter([[['a', '5']]], {
        ...parameters,
        version: '2.0.0',
      })

      expect(filterXmlString).toContain(
        'xmlns:wfs="http://www.opengis.net/wfs/2.0"'
      )
      expect(filterXmlString).toContain('version="2.0.0"')
      expect(filterXmlString).toContain('count="999"')
      expect(filterXmlString).toContain('typeNames="prefix:TyPeNaMe"')
      expect(filterXmlString).toContain(
        '<fes:PropertyIsLike wildCard="*" singleChar="." escapeChar="!"><fes:ValueReference>prefix:a</fes:ValueReference><fes:Literal>5*</fes:Literal></fes:PropertyIsLike>'
      )
    })

    it('creates WFS 2.0.0 conjunctions and sorting with FES elements', () => {
      const filterXmlString = buildWfsFilter(
        [
          [
            ['a', '5'],
            ['b', '3'],
          ],
        ],
        {
          ...parameters,
          version: '2.0.0',
          sortBy: [{ propertyName: 'name', direction: 'DESC' }],
        }
      )

      expect(filterXmlString).toContain('<fes:And>')
      expect(filterXmlString).toContain('</fes:And>')
      expect(filterXmlString).toContain(
        '<fes:SortBy><fes:SortProperty><fes:ValueReference>prefix:name</fes:ValueReference><fes:SortOrder>DESC</fes:SortOrder></fes:SortProperty></fes:SortBy>'
      )
      expect(filterXmlString).not.toContain('ogc:')
    })
  })

  describe('parseWfsResponse', () => {
    it('normalizes OGC CRS URIs before parsing polygon coordinates', async () => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs/2.0" xmlns:gml="http://www.opengis.net/gml/3.2" xmlns:cp="http://inspire.ec.europa.eu/schemas/cp/4.0">
  <wfs:member>
    <cp:CadastralParcel gml:id="CadastralParcel_1">
      <cp:label>12412</cp:label>
      <cp:geometry>
        <gml:Polygon srsName="http://www.opengis.net/def/crs/epsg/0/3857" srsDimension="2">
          <gml:exterior><gml:LinearRing>
            <gml:posList>0 0 1 0 1 1 0 0</gml:posList>
          </gml:LinearRing></gml:exterior>
        </gml:Polygon>
      </cp:geometry>
    </cp:CadastralParcel>
  </wfs:member>
</wfs:FeatureCollection>`
      const response = {
        text: () => Promise.resolve(xml),
      } as Response

      const result = await parseWfsResponse(response, 'label', false, '2.0.0')

      expect(result.features[0]).toMatchObject({
        title: '12412',
        epsg: 'EPSG:3857',
        geometry: { type: 'Polygon' },
      })
    })
  })
})
