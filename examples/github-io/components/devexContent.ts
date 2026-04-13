export const tabs = [
	{ id: 'install', label: 'Install' },
	{ id: 'quickstart', label: 'Quickstart' },
	{ id: 'advanced', label: 'Advanced' },
] as const

export type TabId = (typeof tabs)[number]['id']

export const rawCode: Record<TabId, string> = {
	install: `# npm
npm install @polar/polar

# yarn
yarn add @polar/polar`,

	quickstart: `import { createMap } from '@polar/polar/client'

const map = await createMap(
  'map-container', /* id of the element to replace */
  'https://example.com/services.json', /* or pass an array */
  {
    /* General and plugin configuration should be added here */
  },
  enabledPlugins: [ /* add plugins that you want to use */ ],
)`,

	advanced: `/* Add plugins and subscribe to store changes */
import { addPlugins, createMap, subscribe } from '@polar/polar'
import pluginIconMenu from '@polar/polar/plugins/iconMenu'
import pluginLayerChooser from '@polar/polar/plugins/layerChooser'
import pluginScale from '@polar/polar/plugins/scale'

const map = await createMap('map-container', {
  startCenter: [553655, 6004479],
  epsg: 'EPSG:25832',
  layout: 'nineRegions',
  layers: [{ id: 'basemap', name: 'Basemap' }],
}, 'https://example.com/services.json')

addPlugins(map, [
  pluginIconMenu({
    displayComponent: true,
    layoutTag: 'TOP_RIGHT',
    menus: [[{ plugin: pluginLayerChooser({}) }]],
  }),
  pluginScale({
    displayComponent: true,
    layoutTag: 'BOTTOM_RIGHT',
  }),
])

/* React to store changes */
const unsubscribe = subscribe(map, 'core', 'zoom', (zoom) => {
  console.log('zoom changed to', zoom)
})`,
}
