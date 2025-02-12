# DishExportMap

DishExportMap is a plugin that was created specifically for the internal use of the DISH client. It creates a URL to address a backend that triggeres a PDF print with information about a selected monument and a map section centering on the selected monument.

The original print feature was part of the outdated map in the internal DISH software, so the focus was on recreating the old feature and implement it in the polar client. The backend expects specific values and does not leave much room for different configurations which is the reason for a lot of hardcoded values. Due to missing documentation of the original feature, it is not always clear as to why some values must be set or what their meaning is. The URL has to be composed in a certain way to address the backend so that the print works successfully. 

## URL composition

The following properties need to be defined. Properties without fixed values can be taken from the map or the selected features from the WMS (e.g. scale). The order of the table rows reflects the order in which the properties must appear in the URL.

| parameter name | hardcoded value | description |
| - | - | - |
| objektueberschrift | - | Title consisting of properties of the selected monument. |
| masssstab | - | Current scale of the map. |
| printApproach | 'scale' | No description available. |
| printRequester | 'client' | No description available. |
| id | - | Objectid of the selected monument. |
| xPrint | 18 | No description available. |
| yPrint | 20 | No description available. |
| scale | - | Current scale of the map. |
| xMin | - | Minimum x-value of the bounding box. |
| yMin | - | Minimum y-value of the bounding box. |
| xMax | - | Maximum x-value of the bounding box. |
| yMax | - | Maximum y-value of the bounding box. |
| xCenter | - | x-coordinate of the center for the map section. |
| yCenter | - | y-coordinate of the center for the map section. |
| mapSRS | - | EPSG for the map. |
| urlHintergrund | - | URL of the selected background layer. |
| LayerNameHintergrund | - | Name of the selected background layer. |
| VersionHintergrund | '1.1.1' | Version for background service ⚠️ Do not change. |
| LayerNameWMS | '0,9,1,10,2,11,3,12,4,13,25,27,24,26,6,15,19,30,20,31,21,32,22,33,23,34,29,36,28,35' | Layers from the wms to print. Since they differ from the monument configuration, they are hardcoded and taken from the configuration of the original application to recreate the right look for the map section. | 
| urlWFS | - | URL of the monument wfs. |
| VersionWFS | '1.1.0' |  Version for wfs ⚠️ Do not change. |
| LayerNameWFS | - | Layer for the wfs |
| PropertyNameWFS | 'objektid' | No description available. |
| FilterTypeWFS | 'EQUAL_TO' | No description available. |
| scaleText | - | The scale with unit, e.g. 1000 m. |
| PrintImageURL | host + '/Content/MapsTmp' | Propably the URL to the created map section. The host is set in the configuration of DishMapExport within the `createMap` call. |
| PrintImagePath | 'ContentMapsTmp' |  Propably the relative path to the created map section. |

## Usage

The user selects a feature from the monument WMS within the map that they want to print as a pdf. This selection activates the button "Kartendruck PDF". After pressing the button, a dialog with the editable title for the PDF and a rectangular overlay to show the extent for the map section is displayed. If the user confirms with pressing "Karte drucken", the browser opens a new tab while addressing the backend with the composed URL. The PDF-to-print is shown in this new browser tab.