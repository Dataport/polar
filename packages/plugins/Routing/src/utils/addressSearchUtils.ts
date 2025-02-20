import { FeatureInterface, SearchResponseDataInterface } from '../types'

// TODO: add tsDoc comment
function createSearchUrl(addressSearchUrl, storedQueryID, input) {
  return `${addressSearchUrl}&${new URLSearchParams({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    StoredQuery_ID: storedQueryID, // eslint error has to be ignored, since name is determined by "AddresService HH"
    strassenname: input,
  })}`
}

/**
 * Parses XML response from the search request into structured data.
 *
 * @param text - XML response text.
 * @returns Parsed street data.
 */
function parseResponse(text) {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(text, 'application/xml')
    const members = xmlDoc.getElementsByTagName('wfs:member')
    const features: FeatureInterface[] = []

    for (const member of members) {
      const strasseElement = member.getElementsByTagName('dog:Strassen')[0]

      if (strasseElement) {
        const strassenname =
          strasseElement.getElementsByTagName('dog:strassenname')[0]
            ?.textContent || 'Unbekannt'
        const ortsteilname =
          strasseElement.getElementsByTagName('dog:ortsteilname')[0]
            ?.textContent || 'Unbekannt'
        const position =
          strasseElement.getElementsByTagName('gml:pos')[0]?.textContent || null
        const boundingPolygon =
          strasseElement.getElementsByTagName('gml:posList')[0]?.textContent ||
          null
        const hausnummern: string | null = []
        const hausnummerElements =
          strasseElement.getElementsByTagName('dog:hausnummer')

        for (const hausnummer of hausnummerElements) {
          hausnummern.push(hausnummer.textContent)
        }

        features.push({
          strassenname,
          ortsteilname,
          position: position
            ? position.split(' ').map((coord) => parseFloat(coord))
            : null,
          boundingPolygon: boundingPolygon
            ? boundingPolygon.split(' ').map((coord) => parseFloat(coord))
            : null,
          hausnummern,
        })
      }
    }
    return { features }
  } catch (error) {
    console.error('Error parsing response:', error)
    return { features: [] }
  }
}

/**
 * Parses the response from the house number search.
 *
 * @param responseText - XML response text.
 * @returns Parsed house numbers data.
 */
// eslint-disable-next-line require-await
async function parseResponseHausnummern(responseText: string) {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(responseText, 'application/xml')
    const members = xmlDoc.getElementsByTagName('wfs:member')
    const features: SearchResponseDataInterface[] = []

    for (const member of members) {
      const hauskoordinaten = member.getElementsByTagName(
        'gages:Hauskoordinaten'
      )[0]

      if (hauskoordinaten) {
        const hausnummer =
          hauskoordinaten.getElementsByTagName('dog:hausnummer')[0]
            ?.textContent || ''
        const hausnummerZusatz =
          hauskoordinaten.getElementsByTagName('dog:hausnummernzusatz')[0]
            ?.textContent || ''
        const geographicIdentifier =
          hauskoordinaten.getElementsByTagName(
            'iso19112:geographicIdentifier'
          )[0]?.textContent || ''
        const positionElement =
          hauskoordinaten.getElementsByTagName('gml:pos')[0]
        const position =
          positionElement?.textContent?.split(' ').map(Number) || []
        const polygonElement =
          hauskoordinaten.getElementsByTagName('gml:posList')[0]
        const boundingPolygon =
          polygonElement?.textContent?.split(' ').map(Number) || []

        features.push({
          hausnummer,
          hausnummerZusatz,
          geographicIdentifier,
          position,
          boundingPolygon,
        })
      }
    }
    return { features }
  } catch (error) {
    console.error('Error parsing house numbers response:', error)
    return { features: [] }
  }
}

function handleFetchError(error) {
  console.error('Error in fetchHausnummern:', error)
}

/**
 * Fetches house numbers for a given street name.
 * @param strassenname - The street name to search for.
 * @param url - the URL from the Configuration
 * @returns A list of house numbers.
 */
async function fetchHausnummern(strassenname, url) {
  if (!strassenname) {
    console.error('Strassenname ist leer.')
    return []
  }
  const storedQueryID = 'HausnummernZuStrasse'
  const hausnummerSearchUrl = createSearchUrl(url, storedQueryID, strassenname)
  try {
    const responseText = await fetchSearchData(hausnummerSearchUrl)
    const data = await parseResponseHausnummern(responseText)
    return data.features
  } catch (error) {
    handleFetchError(error)
    return []
  }
}

// TODO: add tsDoc comment
async function processSearchResults(responseText, url) {
  const streetData = await parseResponse(responseText)

  // extract the house numbers for each street of streetData
  const features = streetData.features || []
  for (const feature of features) {
    const hausnummern = await fetchHausnummern(feature.strassenname, url)
    feature.hausnummern = hausnummern.map((item) => item.hausnummer)
  }
  return features
}

// TODO: add tsDoc comment
async function fetchSearchData(url) {
  const response = await fetch(url, { method: 'GET' })
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  const text = await response.text()
  return text
}

export {
  createSearchUrl,
  parseResponse,
  parseResponseHausnummern,
  fetchHausnummern,
  processSearchResults,
  fetchSearchData,
}
