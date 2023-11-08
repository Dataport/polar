import Vue from 'vue'
import Vuetify, { UserVuetifyPreset } from 'vuetify'
import merge from 'lodash.merge'
import kebabCase from 'lodash.kebabcase'
import 'vuetify/dist/vuetify.min.css'
import '@fortawesome/fontawesome-free/css/all.css'

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
    },
  },
  icons: {
    iconfont: 'fa',
  },
}

export default function makeVuetify(
  userParams: UserVuetifyPreset = {}
): Vuetify {
  const merged = merge({}, defaultPreset, userParams)
  const customColors: [string, string][] = Object.entries(
    merged.theme?.themes?.light
  )
  customColors.forEach(([key, value]) =>
    document.documentElement.style.setProperty(
      '--polar-' + kebabCase(key),
      value
    )
  )
  return new Vuetify(merge({}, defaultPreset, userParams))
}
