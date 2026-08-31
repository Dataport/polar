import type { FeatureCollection } from 'geojson'
import type Map from 'ol/Map'
import type { DrawPluginOptionsLayerRevision, GeometryType } from '../../types'

import { t } from 'i18next'

import { notifyUser } from '@/lib/notifyUser'

import { PluginId } from '../../types'
import { autofixFeatureCollection } from './autofix'
import { cloneFeatureCollection } from './cloneFeatureCollection'
import { enrichWithMetaServices } from './enrichWithMetaServices'
import { validateGeoJson } from './validateGeoJson'

let abortController: AbortController | null = null

export const reviseFeatures = async (
	map: Map,
	revisionConfiguration: DrawPluginOptionsLayerRevision,
	featureCollection: FeatureCollection<GeometryType>
) => {
	if (abortController) {
		abortController.abort()
	}
	const thisController = (abortController = new AbortController())

	const { autofix, validate, metaServices } = revisionConfiguration

	// clone to prevent accidentally messing with the draw tool's data
	let revisedFeatureCollection = cloneFeatureCollection(featureCollection)

	if (autofix) {
		try {
			revisedFeatureCollection = autofixFeatureCollection(
				revisedFeatureCollection
			)
		} catch (error) {
			notifyUser('error', () =>
				t(($) => $.revision.autofix.errorToast, { ns: PluginId })
			)
			throw new Error('Autofix failed: ' + (error as Error).message)
		}
	}

	if (validate) {
		revisedFeatureCollection = validateGeoJson(revisedFeatureCollection)
	}

	if (metaServices?.length) {
		try {
			revisedFeatureCollection.features = await enrichWithMetaServices(
				revisedFeatureCollection,
				map,
				metaServices,
				abortController.signal
			)
		} catch (error) {
			if (thisController.signal.aborted) {
				return null
			}
			console.error(error)
			notifyUser('warning', () =>
				t(($) => $.revision.metaInformationRetrieval.errorToast, {
					ns: PluginId,
				})
			)
		}
	}

	return thisController.signal.aborted ? null : revisedFeatureCollection
}
