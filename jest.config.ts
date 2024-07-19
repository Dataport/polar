// names chosen as required
/* eslint-disable @typescript-eslint/naming-convention */
import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  collectCoverageFrom: [
    '**/*.{js,ts,vue}',
    '!**/(node_modules|build|dist|dist-test|.cache|coverage|docs|tests_output)/**',
  ],
  modulePathIgnorePatterns: ['<rootDir>/mpapi/'],
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
    '^.+\\.tsx?$': 'ts-jest',
    '^.*\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    // TODO: Remove both geotiff and quick-lru once we upgraded masterportalapi; see https://github.com/geotiffjs/geotiff.js/issues/292 for more
    '/node_modules/(?!(@repositoryname/vuex-generators|geotiff|quick-lru|ol|@masterportal/masterportalapi)/)',
  ],
}

export default config
