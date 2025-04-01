import core from '@polar/core'
import merge from 'lodash.merge'

import packageInfo from '../package.json'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore | intentional, file is created precompilation (not versioned)
import iconMap from '../assets/dist/iconMap'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore | intentional, file is created precompilation (not versioned)
import cssVariables from '../assets/dist/cssVariables'
import locales from './locales'

// TODO use when implemented
// import GfiContent from './plugins/Gfi'

import './index.css'
import '../assets/dist/diplanStyle.css'

import diplanModule from './store/module'
import { addPlugins } from './addPlugins'
import { MODE } from './mode'

// eslint-disable-next-line no-console
console.log(`DiPlanKarten-POLAR-Client v${packageInfo.version}.`)

const diplanCore = { ...core }

export default {
  createMap: (properties, mode: keyof typeof MODE) => {
    diplanCore.resetPlugins() // cleanup for previous instances, if any
    addPlugins(diplanCore, mode)
    return diplanCore
      .createMap(
        merge(
          {
            mapConfiguration: {
              locales,
              vuetify: {
                theme: {
                  themes: {
                    light: {
                      primary: cssVariables.dpsColorDark,
                      primaryContrast: cssVariables.dpsColorBackground,
                      // secondary not defined; using same as primary
                      secondary: cssVariables.dpsColorDark,
                      secondaryContrast: cssVariables.dpsColorBackground,
                      accent: cssVariables.dpsColorPrimaryTint,
                      error: cssVariables.dpsColorError,
                      info: cssVariables.dpsColorPrimaryDarker,
                      success: cssVariables.dpsColorSuccess,
                      warning: cssVariables.dpsColorWarning,
                    },
                  },
                },
                icons: {
                  values: {
                    ...iconMap,
                  },
                },
              },
            },
          },
          properties
        )
      )
      .then((clientInstance) => {
        clientInstance.$store.registerModule('diplan', diplanModule)
        clientInstance.$store.dispatch('diplan/setupModule')
        return clientInstance
      })
  },
}
