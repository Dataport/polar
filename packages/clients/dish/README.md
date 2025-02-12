# POLAR client DISH

## Content

The client can use two different configurations which are controlled by the parameter `MODE`. `MODE="EXTERN"` will apply the configuration for the map client as the website for the public, and `MODE="INTERN"` for the map used in the internal DISH application. `MODE` is initially set and cannot be changed after hosting. It must be passed in the `createMap` call of the client.

The `index.html` is only used in `EXTERN` mode. 

The DISH client differs from other POLAR clients in that it does not take any additional configuration, but is a closed product. All configuration is done dev-side and is versioned; updates require version updates.

Please see the CHANGELOG.md for all changes after the initial release.

## Usage

The product can be used for two use cases. 

One is a hostable HTML page for the public. Usually, we do not deliver full pages, but rather components. Due to this, it's just that component, but full page width and height. 

The other one is a map that can be embedded in the dish application for internal use and as such is tailored for this specific use case.

Add a query parameter, e.g. `?ObjektID=1506`, to the page's URL to initially focus a feature and display its feature information by ObjektID.

Name and casing of "ObjektID" have been directly taken from the backend to avoid duplicate naming.

## Configuration

The service URLs for the internal monument services (WMS and WFS) need to be configurable. Therefore, the host (`internalHost`), the port and the part of the path that is equal for both services must be defined outside of the map. The `internalHost` and the combination of host, port and path as `internServicesBaseUrl` must be passed to the `createMap` call as attributes of the parameter `urlParams`. 

The `internalHost` is also needed as parameter for the DishExportMap plugin and the gfi plugin, and is passed as attribute of `configOverride` in the `createMap` call. DishExportMap needs this parameter to create the right URL for addressing the backend. The gfi displays photographs of the monuments and uses the parameter as path to the right folder on the server.

The `urlParams` parameter and the configuration for the DishExportMap and supplemental configuration for the gfi plugin is only needed for the internal dish application and can be omitted otherwise.

| fieldName | type | description |
| - | - | - |
| containerId | string | ID of the container the map is supposed to render itself to. |
| mode |  enum["INTERN", "EXTERN"] | Defines the mode in which the map will be started. |
| urlParams | DishUrlParams? | Object to define the internalHost and internServicesBaseUrl for internal services. Mandatory for the mode 'INTERN'. |
| configOverride | object? | This can be used to override the configuration of any installed plugin; see full documentation. In this case, use this object with the plugin names 'dishExportMap' and 'gfi' as properties to define the internalHost for these plugins. Mandatory for the mode 'INTERN'.

### urlParams

| fieldName | type | description |
| - | - | - |
| internalHost | string | The URL of the server where the DISH software and the monument services are hostet. |
| internServicesBaseUrl | string | A combination of host, port and path to create a basis URL that can be used for the monument services that run on the same server. |

### Example configuration

```js
const urlParams = {
    internalHost,
    internServicesBaseUrl: `${internalHost}:${internalPort}/${internalPath}`
}

client.createMap({
    containerId: 'polarstern',
    mode: 'INTERN', // INTERN, EXTERN
    //only needed for internal map
    urlParams,
    configOverride: {
        dishExportMap: {
            internalHost: urlParams.internalHost + ':8082',
        },
        gfi: {
            internalHost: urlParams.internalHost,
        }
    }
})
```