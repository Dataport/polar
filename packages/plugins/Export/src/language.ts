import { LanguageOption } from '@polar/lib-custom-types'

export const resourcesDe = {
  plugins: {
    export: {
      buttons: {
        jpg: 'Als .jpeg exportieren.',
        pdf: 'Als .pdf exportieren.',
        png: 'Als .png exportieren.',
        toggle: 'Exportieren ...',
      },
    },
  },
} as const

export const resourcesEn = {
  plugins: {
    export: {
      buttons: {
        jpg: 'Export as a .jpeg-file.',
        pdf: 'Export as a .pdf-file.',
        png: 'Export as a .png-file.',
        toggle: 'Export ...',
      },
    },
  },
} as const

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: resourcesDe,
  },
  {
    type: 'en',
    resources: resourcesEn,
  },
]

export default language
