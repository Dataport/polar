# POLAR client DISH

## Content

The client can use two different configurations which are controlled by the parameter `MODE` in the index.html. `MODE="EXTERN"` will apply the configuration for the map client as a Website, and `MODE="INTERN"` for the map used in the internal DISH software. `MODE` is initially set and cannot be changed after hosting.

The external DISH client differs from other POLAR clients in that it does not take any additional configuration, but is a closed product. All configuration is done dev-side and is versioned; updates require version updates. 

Please see the CHANGELOG.md for all changes after the initial release.

## Usage

The product is a hostable HTML page. Usually, we do not deliver full pages, but rather components. Due to this, it's just that component, but full page width and height.

Add a query parameter, e.g. `?ObjektID=1506`, to the page's URL to initially focus a feature and display its feature information by ObjektID.

Name and casing of "ObjektID" have been directly taken from the backend to avoid duplicate naming.

The map for the internal DISH software uses different URLs in TEST and PROD systems which need to be defined in the index.html. 
The WMS and WFS for monumental objects are composed from an internal host (`internalHost`) and a port (`internalPort`) as well as a path (`internalPath`). 
The urls `internalHostPrintImage` and `exportMapAsPdfUrl` are needed to create the right url to send to the backend for to print a map in the specific DishExportMap plugin. The original function has been moved from the old openlayers map to the dish client.



