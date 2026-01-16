// service id map to avoid typos, ease renames
const basemap = 'basemapde_farbe'

export default {
  // masterportalAPI parameters
  startResolution: 264.583190458,
  startCenter: [561210, 5932600],
  extent: [
    248651.73157077, 5227198.20287631, 928366.12236557, 6118661.62507136,
  ],
  // diplan-specific configuration example (see API.md)
  diplan: {
    link: {
      href: '../diplan-ui-one',
      icon: '$vuetify.icons.fullscreen',
      label: 'diplan.linkButton.labelSmall',
    },
  },
  // general POLAR parameters
  locales: [
    {
      type: 'de',
      resources: {
        diplan: {
          layers: {
            [basemap]: 'BasemapDE',
          },
          attributions: {
            [basemap]: `$t(diplan.layers.${basemap}) © GeoBasis-DE / BKG <YEAR> CC BY 4.0`,
          },
        },
      },
    },
  ],
  layers: [
    {
      id: basemap,
      visibility: true,
      type: 'background',
      name: `diplan.layers.${basemap}`,
    },
  ],
  attributions: {
    layerAttributions: [
      {
        id: basemap,
        title: `diplan.attributions.${basemap}`,
      },
    ],
  },
}
