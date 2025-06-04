import { MapConfig } from '@polar/lib-custom-types'
import locales from './locales'
import {
  openStreetMap,
  openSeaMap,
  mdiSeaNames,
  wmtsTopplusOpenWeb,
  wmtsTopplusOpenWebGrey,
  wmtsTopplusOpenLight,
  wmtsTopplusOpenLightGrey,
  aerial,
} from './services'
import { theme } from './palettes'

let zoomLevel = 0

// NOTE: Only configure core properties here; plugin details in `addPlugins.ts`
export const mapConfiguration: Partial<MapConfig> = {
  startResolution: 132.291595229,
  startCenter: [475496.3346486868, 5997512.151535563],
  extent: [
    288427.40898665343, 5888233.576754751, 880090.4063210202, 6188713.349959846,
  ],
  locales,
  vuetify: { theme },
  layers: [
    {
      id: wmtsTopplusOpenLight,
      type: 'background',
      name: `textLocator.layers.${wmtsTopplusOpenLight}`,
      visibility: true,
    },
    {
      id: wmtsTopplusOpenLightGrey,
      type: 'background',
      name: `textLocator.layers.${wmtsTopplusOpenLightGrey}`,
    },
    {
      id: wmtsTopplusOpenWeb,
      type: 'background',
      name: `textLocator.layers.${wmtsTopplusOpenWeb}`,
    },
    {
      id: wmtsTopplusOpenWebGrey,
      type: 'background',
      name: `textLocator.layers.${wmtsTopplusOpenWebGrey}`,
    },
    {
      id: openStreetMap,
      type: 'background',
      name: `textLocator.layers.${openStreetMap}`,
    },
    {
      id: aerial,
      type: 'background',
      name: `textLocator.layers.${aerial}`,
    },
    {
      id: openSeaMap,
      type: 'mask',
      name: `textLocator.layers.${openSeaMap}`,
      visibility: true,
    },
    {
      id: mdiSeaNames,
      type: 'mask',
      name: `textLocator.layers.${mdiSeaNames}`,
      visibility: true,
    },
  ],
  options: [
    { resolution: 2116.66552366, scale: 10000000, zoomLevel: zoomLevel++ },
    { resolution: 1058.33276183, scale: 5000000, zoomLevel: zoomLevel++ },
    { resolution: 529.166380916, scale: 2500000, zoomLevel: zoomLevel++ },
    { resolution: 264.583190458, scale: 1000000, zoomLevel: zoomLevel++ },
    { resolution: 132.291595229, scale: 500000, zoomLevel: zoomLevel++ },
    { resolution: 66.14579761460263, scale: 250000, zoomLevel: zoomLevel++ },
    { resolution: 26.458319045841044, scale: 100000, zoomLevel: zoomLevel++ },
    { resolution: 15.874991427504629, scale: 60000, zoomLevel: zoomLevel++ },
    { resolution: 10.583327618336419, scale: 40000, zoomLevel: zoomLevel++ },
    { resolution: 5.2916638091682096, scale: 20000, zoomLevel: zoomLevel++ },
    { resolution: 2.6458319045841048, scale: 10000, zoomLevel: zoomLevel++ },
    { resolution: 1.3229159522920524, scale: 5000, zoomLevel: zoomLevel++ },
    { resolution: 0.6614579761460262, scale: 2500, zoomLevel: zoomLevel++ },
    { resolution: 0.2645831904584105, scale: 1000, zoomLevel: zoomLevel++ },
    { resolution: 0.1322915952292052, scale: 500, zoomLevel: zoomLevel++ },
  ],
}
