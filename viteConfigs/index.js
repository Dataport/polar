import merge from 'lodash.merge'
import clientConfiguration from './vite.client'

export function getClientConfig(options = {}) {
	return merge(clientConfiguration, options)
}
