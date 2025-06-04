import path from 'path'
import merge from 'lodash.merge'
import clientConfiguration from './vite.client'
import codeConfiguration from './vite.code'

const { name } = path.resolve(__dirname, 'package.json')

export function getCodeConfig(options = {}) {
  return merge(codeConfiguration, { build: { lib: { name } } }, options)
}

export function getClientConfig(options = {}) {
  return merge(clientConfiguration, options)
}
