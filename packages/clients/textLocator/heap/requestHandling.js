import WKT from 'ol/format/WKT.js'

const ignoreIdsName = ['EuroNat-33']
const ignoreIdsGeometries = [
  'EuroNat-33',
  'SH-WATTENMEER-DM-1',
  'SH-WATTENMEER-1',
  'Ak2006-51529',
  'Landsg-2016-110',
]
const nameGeometryDict = {}
let titleLocationFreqDict = {}

const WKTfmt = new WKT()

// endpoint configuration - load endpoints from a json file and fall back to default config if that json is not available
const defaultConfig = {
  backend_endpoint: 'http://localhost:8000',
}

let config_data = null
async function loadConfig() {
  if (config_data != null) {
    return config_data
  }
  try {
    const response = await fetch('./textloc-config.json')
    if (response.ok) {
      const config = await response.json()
      config_data = config
      return config
    }
    console.error(
      'config request failed:',
      response.status,
      response.statusText
    )
    return defaultConfig
  } catch (error) {
    console.error('config request error:', error)
    return defaultConfig
  }
}

class requestHandler {
  constructor() {}
}

/**
 * Extract all location names and geometries from the gazetteer response json while skipping names that have an ignoreId
 * example for data value: [{"id":"shnwattdt075","names":[{"ObjectID":"shnwatthist1912003","GeomID":"shnwattdt075","Start":"1868-01-01","Ende":"1875-12-31","Name":"Bielshöven","Rezent":false,"Sprache":"Hochdeutsch","Typ":"früherer Name, hist. Name","Quellen":[{"Autor":"F.A. Meyer","Datum":"1875","Titel":"Elbemündung ( Katalognummer 81)","Media":"A.W. Lang, Historisches Seekartenwerk der Deutschen Bucht ( Neumünster 1969-1981)","Ort":"Hamburg"},{"Autor":"F.A. Meyer","Datum":"1868","Titel":"Einsegelung in die Elbe ( Katalognummer 75)","Media":"A.W. Lang, Historisches Seekartenwerk der Deutschen Bucht ( Neumünster 1969-1981)","Ort":"Hamburg"}]},
 * @param {dictionary} data
 * @param {list of string} ignoreIds
 * @returns
 */
function extractNamesAndGeometries(data) {
  const namesList = []
  const allGeometriesList = []
  data.forEach((entry) => {
    if (!ignoreIdsName.includes(entry.id)) {
      if (entry.names && Array.isArray(entry.names)) {
        entry.names.forEach((nameObj) => {
          if (nameObj.Name) {
            namesList.push(nameObj.Name)
          }
          if (!ignoreIdsGeometries.includes(entry.id)) {
            const geometriesList = []
            if (entry.geoms && Array.isArray(entry.geoms)) {
              entry.geoms.forEach((geomObj) => {
                if (geomObj.WKT) {
                  allGeometriesList.push(geomObj.WKT)
                  geometriesList.push(geomObj.WKT)
                }
              })
            }
            nameGeometryDict[nameObj.Name] = geometriesList
          }
        })
      }
    }
  })
  return [namesList, allGeometriesList, nameGeometryDict]
}

/**
 * send a request to our own backend to search for articles that contain the location names returned by the kuesten gazetteer.
 * Each location has their own BM25 search, such that the frequencies can be determined for each location
 * @param {*} locationNamesArray
 * @returns {dictionary} - dictionary that contains the found article titles as keys and another dict with location : frequency pairs
 * as values
 */
async function locationLookupIndividually(locationNamesArray) {
  const config = await loadConfig()
  const url = config.backendEndpoint + 'lookup/locations_individually'

  const locationsArray = { location_names: locationNamesArray }
  const requestData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(locationsArray),
  }

  try {
    const response = await fetch(url, requestData)
    if (response.ok) {
      const data = await response.json()
      return data
    }
    console.error('Request failed:', response.status, response.statusText)
    return null
  } catch (error) {
    console.error('Request error:', error)
    return null
  }
}

/**
 * send a request to our own backend to search for articles that contain the location names returned by the kuesten gazetteer.
 * All locations are run through the BM25 algorithm bundled together
 * @param {string} name - comma seperated location names
 * @returns
 */
async function locationLookup(name) {
  const config = await loadConfig()
  const url = config.backendEndpoint + 'lookup/location_name'

  const requestData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  }

  try {
    const response = await fetch(url, requestData)
    if (response.ok) {
      const data = await response.json()
      return data
    }
    console.error('Request failed:', response.status, response.statusText)
    return null
  } catch (error) {
    console.error('Request error:', error)
    return null
  }
}

/**
 * Main function to run when user clicks on the map. Requests locations from the Gazetteer and searches locations in articles via
 * our backend
 * @param {*} geometry
 * @param {*} popup_position
 * @param {*} mapClass
 * @param {*} htmlCreator
 * @returns
 */
export const searchAction = async (
  geometry,
  popup_position,
  mapClass,
  htmlCreator
) => {
  mapClass.showPopup('Suche nach Ortsnamen...', popup_position)
  mapClass.displayUserSelectedPoly(geometry)
  let resultJSON = await requestResultJSON(geometry, 1)
  console.log('fetched result')
  console.log(resultJSON)
  if (resultJSON == undefined) {
    mapClass.showPopup(
      'Die Suche nach Ortsnamen ist fehlgeschlagen.',
      popup_position
    )
    return
  }
  var [locationNamesArray, geometriesList, nameGeometryDict] =
    extractNamesAndGeometries(resultJSON.results)
  console.log(locationNamesArray)
  console.log(geometriesList)
  console.log(nameGeometryDict)
  if (resultJSON.pages > 1) {
    for (let page = 2; page <= resultJSON.pages; page++) {
      mapClass.showPopup(
        'Suche nach Ortsnamen... ' + page + ' / ' + resultJSON.pages,
        popup_position
      )
      resultJSON = await requestResultJSON(geometry, page)
      var [locationNamesPages, geometriesPages, nameGeometryDict] =
        extractNamesAndGeometries(resultJSON.results)
      locationNamesArray = locationNamesArray.concat(locationNamesPages)
      geometriesList = geometriesList.concat(geometriesPages)
    }
  }

  htmlCreator.populateSidebarLocations(
    locationNamesArray,
    mapClass,
    nameGeometryDict
  )
  mapClass.popupCloser.onclick()
  const locationNames = locationNamesArray.join(',')
  console.log('location names: ' + locationNames)
  mapClass.displayGeometriesOnMap(geometriesList)

  mapClass.showPopup('Suche nach passenden Texten...', popup_position)
  const lookupResults = await locationLookupIndividually(locationNamesArray)
  if (lookupResults == null) {
    mapClass.showPopup(
      'Die Suche nach passenden Texten ist fehlgeschlagen.',
      popup_position
    )
    return
  }

  titleLocationFreqDict = lookupResults.title_location_freq

  let result_text =
    "<div class='search_results'>Suchergebnisse</div><div class='search_terms'>Suchbegriffe: " +
    locationNames +
    '</div>'
  for (const article_title in titleLocationFreqDict) {
    console.log(article_title)
    result_text += '<div>' + article_title + '</div>\n'
  }
  mapClass.popupCloser.onclick()
  htmlCreator.populateSidebarTexts(
    titleLocationFreqDict,
    nameGeometryDict,
    mapClass
  )
}
