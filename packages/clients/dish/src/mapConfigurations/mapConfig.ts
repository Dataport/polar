import { MapConfig } from '@polar/lib-custom-types'
import locales from '../locales'
import { shBlue, shWhite } from '../colors'
import { DishMapConfig, DishUrlParams } from '../types'
import { options } from '../utils/calculateScaleFromResolution'
import { mapConfigIntern } from './mapConfigIntern'
import { mapConfigExtern } from './mapConfigExtern'

const commonMapConfiguration: Partial<MapConfig> = {
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
  options,
}

export const getMapConfiguration = (
  mode: string,
  urlParams: DishUrlParams = { internalHost: '', internServicesBaseUrl: '' }
): DishMapConfig => ({
  ...commonMapConfiguration,
  ...(mode === 'INTERN' ? mapConfigIntern(urlParams) : mapConfigExtern),
  dishModal: {
    isInternMap: mode === 'INTERN',
  },
})
