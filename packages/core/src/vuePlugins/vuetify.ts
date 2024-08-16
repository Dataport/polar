import Vue from 'vue'
import Vuetify, { UserVuetifyPreset } from 'vuetify'
import merge from 'lodash.merge'
import kebabCase from 'lodash.kebabcase'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

const defaultPreset: UserVuetifyPreset = {
  theme: {
    themes: {
      light: {
        primary: '#003064',
        primaryContrast: '#FFFFFF',
        secondary: '#FFFFFF',
        secondaryContrast: '#003064',
      },
      dark: {
        primary: '#4A90E2',
        primaryContrast: '#121212',
        secondary: '#121212',
        secondaryContrast: '#4A90E2',
      },
    },
  },
  icons: {
    iconfont: 'fa',
  },
}

export default function makeVuetify(
  userParams: UserVuetifyPreset = {}
): Vuetify {
  const isDarkMode = defaultPreset.theme?.dark
  const merged = merge({}, defaultPreset, userParams)
  const customColors: [string, string][] = Object.entries(
    isDarkMode ? merged.theme?.themes?.dark : merged.theme?.themes?.light
  )
  customColors.forEach(([key, value]) =>
    document.documentElement.style.setProperty(
      '--polar-' + kebabCase(key),
      value
    )
  )
  return new Vuetify(merge({}, defaultPreset, userParams))
}
