import merge from 'lodash.merge'
import locales from './locales'
import { shBlue, shWhite } from './colors'
import { internMapConfiguration } from './internMapConfiguration'
import { exportMapConfiguration } from './externMapConfiguration'

let zoomLevel = 0

const commonMapConfiguration = {
  checkServiceAvailability: true,
  startResolution: 264.583190458,
  startCenter: [553655.72, 6004479.25],
  extent: [426205.6233, 5913461.9593, 650128.6567, 6101486.8776],
  locales,
  vuetify: {
    theme: {
      themes: {
        light: {
          primary: shBlue,
          primaryContrast: shWhite,
          secondary: shWhite,
          secondaryContrast: shBlue,
        },
      },
    },
  },
  options: [
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
    { resolution: 0.06614579761, scale: 250, zoomLevel: zoomLevel++ },
    { resolution: 0.02645831904, scale: 100, zoomLevel: zoomLevel++ },
    { resolution: 0.01322915952, scale: 50, zoomLevel: zoomLevel++ },
  ],
}

export const getMapConfiguration = (
  mode: string,
  internServicesBaseUrl = ''
) => {
  const config = merge({
    ...commonMapConfiguration,
    ...(mode === 'INTERN'
      ? internMapConfiguration(internServicesBaseUrl)
      : exportMapConfiguration),
  })
  return config
}
