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
    '^.+\\.tsx?$': 'ts-jest',
    '^.*\\.js$': 'babel-jest',
  },
  // jest-canvas-mock and setup file is required because of @masterportal/masterportalapi; setup file is based on setup file from @masterportal/masterportalapi setup
  setupFiles: ['jest-canvas-mock'],
  setupFilesAfterEnv: ['./__mocks__/jest.setup.js'],
  transformIgnorePatterns: [
    '/node_modules/(?!(@repositoryname/vuex-generators|@masterportal/masterportalapi|ol|pbf|earcut|geotiff|rbush|quickselect|quick-lru|color-(space|parse|rgba|name))/)',
  ],
}

export default config
