import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  collectCoverageFrom: [
    '**/*.{js,ts,vue}',
    '!**/(node_modules|build|dist|dist-test|.cache|coverage|docs|tests_output)/**',
  ],
  modulePathIgnorePatterns: ['<rootDir>/mpapi/', '/e2e/'],
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  moduleNameMapper: {
    'vuetify/lib': '<rootDir>/node_modules/vuetify/es5',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|sass)$': '<rootDir>/__mocks__/styleMock.js',
  },
  testEnvironment: 'jsdom',
  transform: {
    '^[^.]+.vue$': '@vue/vue2-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // TypeScript-Fehler ignorieren
        isolatedModules: true, // Option 1: Nur ein Modul auf einmal prüfen
        diagnostics: false, // Option 2: Alle Typfehler ignorieren
      },
    ],
    '^.*\\.js$': 'babel-jest',
  },
  setupFiles: ['jest-canvas-mock'],
  setupFilesAfterEnv: ['./__mocks__/jest.setup.js'],
  transformIgnorePatterns: [
    '/node_modules/(?!(@repositoryname/vuex-generators|@masterportal/masterportalapi|ol|pbf|earcut|geotiff|rbush|quickselect|quick-lru|color-(space|parse|rgba|name))/)',
  ],
}

export default config
