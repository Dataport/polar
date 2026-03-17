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

	quickstart: `import { createMap } from '@polar/polar'

const map = await createMap(
  'map-container',   // id of the element to replace
  {
    startCenter: [553655, 6004479],
    layers: [
      { id: 'basemap', name: 'Basemap' },
    ],
  },
  'https://example.com/services.json' // or pass array directly
)`,

	advanced: `// Add plugins and subscribe to store changes
import { addPlugins, getStore, subscribe } from '@polar/polar'
import pluginIconMenu from '@polar/polar/plugins/iconMenu'
import pluginLayerChooser from '@polar/polar/plugins/layerChooser'
import pluginScale from '@polar/polar/plugins/scale'

const map = await createMap('map-container', {
  startCenter: [553655, 6004479],
  epsg: 'EPSG:25832',
  layout: 'nineRegions',
  layers: [{ id: 'basemap', name: 'Basemap' }],
}, serviceRegister)

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

// React to store changes
const unsubscribe = subscribe(map, 'core', 'zoom', (zoom) => {
  console.log('zoom changed to', zoom)
})`,
}

export const checklist = [
	'Regular updates and improvements',
	'Configurable solutions',
	'Built upon Open Geospatial Consortium Guidelines',
	'Comprehensive documentation and examples',
	'Public Money, Public Code',
]
