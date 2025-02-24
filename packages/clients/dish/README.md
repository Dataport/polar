# POLAR client DISH

## Content

The DISH client is used to display information about monuments. It is versioned; updates require version updates.

Please see the CHANGELOG.md for all changes after the initial release.

## Usage

The product can be used for two use cases. 

One is a hostable HTML page for the public. Usually, we do not deliver full pages, but rather components. Due to this, it's just that component, but full page width and height. 

The other one is a map that can be embedded in the dish application for internal use and as such is tailored for this specific use case.

Add a query parameter, e.g. `?ObjektID=1506`, to the page's URL to initially focus a feature and display its feature information by ObjektID.

Name and casing of "ObjektID" have been directly taken from the backend to avoid duplicate naming.

## Configuration

| fieldName | type | description |
| - | - | - |
| containerId | string | ID of the container the map is supposed to render itself to. |
| mode |  enum["INTERN", "EXTERN"] | Defines the mode in which the map will be started. |
| urlParams | DishUrlParams? | Object to define the internalHost and internServicesBaseUrl for internal services. Mandatory for the mode 'INTERN'. |
| configOverride | object? | This can be used to override the configuration of any installed plugin; see full documentation. In this case, use this object with the plugin name 'gfi' as property to define the `internalHost` for these plugin. Mandatory for the mode 'INTERN'. |

### urlParams

| fieldName | type | description |
| - | - | - |
| internalHost | string | The URL of the server where the DISH software and the monument services are hosted. |
| internServicesBaseUrl | string | A combination of host, port and path to create a base URL that can be used for the monument services that run on the same server. |

The `internalHost` is also needed as parameter for the gfi plugin. It displays photographs of the monuments and uses the parameter as path to the right folder on the server.

### Example configuration

```js
const urlParams = {
  internalHost,
  internServicesBaseUrl: `${internalHost}:${internalPort}/${internalPath}`
}

client.createMap({
  containerId: 'polarstern',
  mode: 'INTERN', // INTERN, EXTERN
  // only needed for internal map
  urlParams,
  configOverride: {
    gfi: {
      internalHost: urlParams.internalHost,
    }
  }
})
```