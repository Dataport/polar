import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
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
    },
  },
  {
    type: 'en',
    resources: {
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
    },
  },
]

export default language
