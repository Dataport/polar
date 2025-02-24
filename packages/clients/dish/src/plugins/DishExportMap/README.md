# DishExportMap

DishExportMap is a plugin that was created specifically for the internal use of the DISH client. It creates a URL to address a backend that triggeres a PDF print with information about a selected monument and a map section centering on the selected monument.

The original print feature was part of the outdated map in the internal DISH software, so the focus was on recreating the old feature and implement it in the polar client. The backend expects specific values and does not leave much room for different configurations which is the reason for a lot of hardcoded values. Due to missing documentation of the original feature, it is not always clear as to why some values must be set or what their meaning is. The URL has to be composed in a certain way to address the backend so that the print works successfully. 

## Plugin Configuration

The following parameters for the plugin must be defined in the map configuration. As to this moment, most of these should not be changed due to the restricted backend. 

| parameter name | type | description |
| - | - | - |
| printApproach | string | No description available. |
| printRequester | string | No description available. |
| xPrint | number | No description available. |
| yPrint | number | No description available. |
| VersionHintergrund | string | Version for background service. |
| LayerNameWMS | string | Layers from the WMS to print. Since they differ from the monument configuration, they are hardcoded and taken from the configuration of the original application to recreate the right look for the map section. | 
| VersionWFS | string |  Version for WFS. |
| PropertyNameWFS | string | No description available. |
| FilterTypeWFS | string | No description available. |
| PrintImageURL | internalHost + '/Content/MapsTmp' | Probably the URL to the created map section. The internalHost is set in the urlParams. |
| PrintImagePath | string |  Probably the relative path to the created map section. |
| urlParams | DishUrlParams | These parameters are needed to create the url to the backend and the default layer urls. The urlParams should be set in the `createMap` call. |

### example configuration

```js
dishExportMap: {
  printApproach: 'scale',
  printRequester: 'client',
  xPrint: 18,
  yPrint: 20,
  versionHintergrund: '1.1.1' // ⚠️ Do not change
  proxyHintergrund: 'y',
  versionWMS: '1.1.1',
  layerNameWMS:
    '0,9,1,10,2,11,3,12,4,13,25,27,24,26,6,15,19,30,20,31,21,32,22,33,23,34,29,36,28,35',
  versionWFS: '1.1.0'  // ⚠️ Do not change
  propertyNameWFS: 'objektid',
  filterTypeWFS: 'EQUAL_TO',
  printImagePath: 'ContentMapsTmp',
  urlParams: {
    internalHost: 'http://10.61.63.54',
    internServicesBaseUrl: 'http://10.61.63.54:8081/dish-deegree-3.5.0/services'
  },
},
```


## Usage

The user selects a feature from the monument WMS within the map that they want to print as a pdf. This selection activates the button "Kartendruck PDF". After pressing the button, a dialog with the editable title for the PDF and a rectangular overlay to show the extent for the map section is displayed. If the user confirms with pressing "Karte drucken", the browser opens a new tab while addressing the backend with the composed URL. The PDF-to-print is shown in this new browser tab.