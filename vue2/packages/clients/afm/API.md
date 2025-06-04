# POLAR AfM map client

This is a default compilation of POLAR feature packages for online services. This document and its child documents describe the setup.

For all additional details, check the [full documentation](https://dataport.github.io/polar/docs/afm/client-afm.html).

## Requirements

To understand this document, programming knowledge (preferably in JavaScript) are required. This is a technical document describing how to integrate the map client with its programmatic API.

## Versioning

The map client honors [SemVer](https://semver.org/lang/de/) versioning. Breaking Changes without a change in leading version number are bugs.

## Library integration

You may either use the AfM client with import syntax or via HTML tags. In the following, the integration via HTML is shown.

```html
<script src="<Path>/dist/polar-client.js"></script>
```

The global variable `MapClient` is now available. All other files in the dist folder are pulled on demand by relative pathing.

## Configuration and creation

The map client can be controlled with a configuration object. An example file is supplied in the folder `example`. This file can be used as base for your own configuration.

### Programmatic integration

The following is an abstract example.

In your HTML, a div with unique ID is required that holds the following style properties. Width and height can be changed as you need, but are required to be defined.

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

```js
/* Services registration. Either a link to a services file (e.g. https://geodienste.hamburg.de/services-internet.json) or a local array. Check the core documentation for more details, linked at the end of this document. */
MapClient.rawLayerList.initializeLayerList(services, callback)

function callback (services) {
  // services now ready
  MapClient
    .createMap({
      // arbitrary, must be in surrounding HTML document
      containerId: "polarstern",
      // see core documentation on possibilities for this object
      mapConfiguration: {
        ...mapConfiguration,
        layerConf: services,
        // path to CSS file included in the package (as if it was a link tag's href)
        stylePath: "./polar-client.css"
      },
    })
    .then((map) => {
      /* Map initialized – now listeners may be registered. Check the plugin
       * linked at the end of the document for available keys. */
      map.subscribe(
        'plugin/zoom/zoomLevel',
        (zoomLevel) => { /* Your code here. */ }
      )
    })
```
