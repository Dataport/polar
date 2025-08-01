import { toMerged } from 'es-toolkit'
import clientConfiguration from './vite.client'

export function getClientConfig(options = {}) {
	return toMerged(clientConfiguration, options)
}
