---
title: Configuration
---

# Configuration
POLAR is configured when you create a map. The generic client uses a service register and a configuration object to determine which layers and plugins are available.

## Use the generic client
For a standard map application, install `@polar/polar` and import its generic client:

```sh
npm install @polar/polar
```

The map container needs an explicit size. Pass either a service-register URL or a service-register array to `createMap`. The keys in the configuration object enable and configure plugins. The live example below uses the same configuration as the code sample.

```html
<div id="map" style="width: 100%; height: 600px; position: relative;"></div>
```

```js
import { createMap } from '@polar/polar/client'

await createMap(
	'map',
	'../services.json',
	{
		startCenter: [573575, 6018990],
		layers: [
			{
				id: '23420',
				name: 'basemap.de Web Raster Farbe',
				type: 'background',
				visibility: true,
			},
		],
		layout: 'nineRegions',
		scale: {},
	}
)
```

The repository includes a minimal [`services.json`](../services.json) for this example. It defines the `23420` basemap as a WMS background layer. Replace it with your own service register when integrating POLAR into an application. See the [API Reference](../reference/) for the complete configuration types and plugin options.

<iframe
	src="../configuration-demo.html"
	title="Interactive POLAR map configuration example"
	style="width: 100%; height: 600px; border: 0;"
></iframe>

## Choose your path

### Use POLAR in an application
Start with the generic client and the configuration pattern above. The repository also contains a [complete generic client example](https://github.com/Dataport/polar/tree/next/examples/generic) with a service register, layers, markers, search, pins, and map controls.

### Build a specialized client
Create a separate client when your application needs its own defaults or domain-specific behavior. The architecture decision [Split customer-specific clients into separate repositories](architecture/decisions/ADR-0011.md) explains this boundary.

### Contribute to POLAR
For changes to the core package, plugins, or shared libraries, continue with the [Development guide](development.md) and [Architecture documentation](architecture/index.md).

