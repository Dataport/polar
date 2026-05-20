import { toMerged } from 'es-toolkit'
import { GeoJSON, WFS } from 'ol/format'
import { transform as transformCoordinates } from 'ol/proj'

import type { PolarGeoJsonFeature, PolarGeoJsonFeatureCollection } from '@/core'

import { getFeatureTitleFromPattern } from './getFeatureTitleFromPattern'

const parser = new WFS()
const writer = new GeoJSON()

/**
 * Parses the response from a GetRequest to a WFS.
 *
 * @param response - Response from the fetch request.
 * @param title - Which fieldName(s) to use for display purposes; e.g. used in the AddressSearch for the result list.
 * @param useTitleAsPattern - whether title contains patterns from config.
 * @param epsg - Currently used projection of the map.
 */
export async function parseWfsResponse(
	response: Response,
	title: string | string[] | undefined,
	useTitleAsPattern: boolean,
	epsg: string
) {
	const features: PolarGeoJsonFeature[] = []
	const featureCollection: PolarGeoJsonFeatureCollection = {
		type: 'FeatureCollection',
		features,
	}

	const text = await response.text()
	const parsedFeatures = parser.readFeatures(text)
	const epsgCode =
		// @ts-expect-error | srsName is there, I've seen it – probably a type-bug in OL?
		parser.readFeatureCollectionMetadata(text).srsName?.split('::')?.[1] ??
		// if srs not on root node, but on children, take first-best match
		text.match(/srsName="[^"]*EPSG:(\d+)/)?.[1]

	parsedFeatures.forEach((f) => {
		const featureObject = JSON.parse(writer.writeFeature(f))
		featureObject.title = ''
		if (title) {
			if (useTitleAsPattern) {
				featureObject.title = getFeatureTitleFromPattern(
					featureObject,
					title as string[]
				)
			} else {
				featureObject.title = Array.isArray(title)
					? title.map((part) => featureObject.properties[part]).join(' ')
					: featureObject.properties[title]
			}
		}
		if (epsgCode) {
			featureObject.geometry = toMerged(featureObject.geometry, {
				coordinates: transformCoordinates(
					featureObject.geometry.coordinates,
					`EPSG:${epsgCode}`,
					epsg
				),
			})
		}
		features.push(featureObject)
	})

	return featureCollection
}
