# POLAR client DISH

## Content

The client can use two different configurations which are controlled by the parameter `MODE`. `MODE="EXTERN"` will apply the configuration for the map client as the website for the public, and `MODE="INTERN"` for the map used in the internal DISH application. `MODE` is initially set and cannot be changed after hosting.

The DISH client differs from other POLAR clients in that it does not take any additional configuration, but is a closed product. All configuration is done dev-side and is versioned; updates require version updates.

Please see the CHANGELOG.md for all changes after the initial release.

## Usage

The product can be used for two use cases. 

One is a hostable HTML page for the public. Usually, we do not deliver full pages, but rather components. Due to this, it's just that component, but full page width and height. 

The other one is a map that can be embedded in the dish application for internal use.

Add a query parameter, e.g. `?ObjektID=1506`, to the page's URL to initially focus a feature and display its feature information by ObjektID.

Name and casing of "ObjektID" have been directly taken from the backend to avoid duplicate naming.

Some service URLs for the internal DISH application need to be configurable. Therefore, the host (`internalHost`), port and first part of the path must be defined outside of the map. The `internalHost` and the combination of host, port and path as `internServicesBaseUrl` must be passed to the `createMap` call as attributes of the parameter `urlParams`. 

The `internalHost` is also needed as parameter for the DishExportMap plugin. 

For external use as public webpage pass `urlParams` as empty object.




