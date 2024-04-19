# Generic MapClient API 🗺️ `@polar/client-generic`

This client is based on [POLAR](https://github.com/Dataport/polar) and subsequently the [masterportalAPI](https://bitbucket.org/geowerkstatt-hamburg/masterportalapi/src/master/). The following documentation only contains how this specific client can be used, and the minimal information required to get it running.

For all additional details, check the [full documentation](https://dataport.github.io/polar/docs/generic/client-generic.html).

For the development test deployments and example configurations, [see here](https://dataport.github.io/polar#plugin-gallery).

For a minimum working example, [see here](https://github.com/dopenguin/polar-fossgis-2024).

## Basic usage

The NPM package `@polar/client-generic` can be installed via NPM or downloaded from the [release page](https://github.com/Dataport/polar/releases). When using `import mapClient from '@polar/client-generic'`, the object `mapClient` contains a method `createMap`. This is the main method required to get the client up and running. Should you use another import method, check the package's `dist` folder for available files.

The method expects a single object with the following parameters.

| fieldName | type | description |
| - | - | - |
| containerId | string | ID of the container the map is supposed to render itself to. |
| services | object[] \| string | Either a link to a service registry or an array containing service description objects. For more details, see the startup section on [POLAR documentation](https://dataport.github.io/polar/documentation.html#configuration). This parameter can be seen as an accesible version of `mapConfiguration.layerConf`. |
| mapConfiguration | object | See [documentation of `@polar/core`](https://dataport.github.io/polar/docs/generic/core.html) for all possible configuration options. |
| enabledPlugins  | string[]? | This is a client-specific field. Since the `@polar/client-generic` client contains all existing plugins, they are activated by strings. The strings match their package names: `'address-search' \| 'attributions' \| 'draw'* \| 'export' \| 'filter'* \| 'fullscreen'* \| 'geo-location'* \| 'gfi'* \| 'icon-menu' \| 'layer-chooser'* \| 'legend' \| 'loading-indicator' \| 'pins' \| 'reverse-geocoder' \| 'scale' \| 'toast' \| 'zoom'*`. The plugins marked with * are nested in the `'icon-menu'` in this pre-layouting, hence they depend upon it being active, too. |
| modifyLayerConfiguration | ((layerConf: object[]) => object[])? | Defaults to identity function. This function is applied to the loaded layer configuration before usage. That is, the `services` can be modified by this to e.g. set parameters not supported by the service register, add additional layers, and so on. |

In your HTML, a div with unique ID (`containerId` from above) is required that holds the following style properties. Width and height can be changed as you need, but are required to be defined.

```html
<div
  style="
    width: 680px;
    height: 420px;
    position: relative;
  "
  id="polarstern"
>
  <!-- Optional, may use if your page does not have its own <noscript> information -->
  <noscript>Please use a browser with active JavaScript to use the map client.</noscript>
</div>
```

`createMap` returns a Promise of a map instance. This returned instance is required to retrieve information from the map.

The package also includes a `style.css` and an `index.html` file. The `style.css`'s relative path must, if it isn't the default value `'./style.css'`, be included in the `mapConfiguration` as follows:

```js
{
  // ...
  stylePath: '../the/relative/path/style.css'
}
```

The value to `stylePath` is the same as as a `link` tag would have in its `href`.

### Destroy instance

The `mapInstance` returned by the `createMap` call can be destroyed by calling `mapInstance.$destroy`. This will not remove the rendered HTML, but unlink all internal creations and effects. This should be called before re-navigating, usual lifecycle hooks are `beforeDestroy` or `beforeUnmount`, depending on the framework in use.

After this, `createMap` can be used again when the DOM is restored. That is, the original `div` with its `id` must be recreated, since POLAR changes the DOM in the `div`. Normally, an SPA will take care of this by itself since it will render the outlying component anew.

Should this not be the case in your framework, the following snippet restores the DOM:

```js
// assuming the render div's id was `"polarstern"`
const polarstern = document.getElementById('polarstern-wrapper')
const newStar = document.createElement('div')
newStar.id = 'polarstern'
newStar.classList.add('polarstern')
polarstern?.parentElement?.replaceChild(newStar, polarstern)
```
