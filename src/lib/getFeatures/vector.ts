import { rawLayerList } from '@masterportal/masterportalapi'
import { Feature } from 'ol'

const supportedFormats = ['OAF', 'WFS']

export function getVectorFeaturesByBboxRequest(
	signal: AbortSignal | null,
	bbox: number[],
	fetchLayerId: string,
	projectionCode: string
) {
	const serviceDefinition = rawLayerList.getLayerWhere({ id: fetchLayerId })
	if (!supportedFormats.includes(serviceDefinition.typ)) {
		throw new Error(
			`Layer with ID "${fetchLayerId}" of type "${serviceDefinition.typ}" was used to retrieve vector data, but is not within the range of supported types [${supportedFormats.toString()}].`
		)
	}

	const [codeName, codeNumber] = projectionCode.split(':')

	return fetch(
		serviceDefinition.typ === 'OAF'
			? [
					serviceDefinition.url,
					'collections',
					serviceDefinition.collection,
					`items?f=json&limit=100&bbox=${bbox.toString()}&bbox-crs=http://www.opengis.net/def/crs/${codeName}/0/${codeNumber}&crs=http://www.opengis.net/def/crs/${codeName}/0/${codeNumber}`,
				].join('/')
			: `${serviceDefinition.url}${[
					`?service=${serviceDefinition.typ}`,
					`version=${serviceDefinition.version}`,
					`request=GetFeature`,
					`srsName=${projectionCode}`,
					`typeName=${serviceDefinition.featureType}`,
					`bbox=${bbox.toString()},${projectionCode}`,
				].join('&')}`,
		{ signal }
	)
}

export function getVectorFeaturesByFeatureRequest(
	signal: AbortSignal | null,
	feature: Feature,
	fetchLayerId: string,
	projectionCode: string
) {
	const bbox = feature.getGeometry()?.getExtent()

	if (typeof bbox === 'undefined') {
		throw new Error('Given feature had no extent.')
	}

	return getVectorFeaturesByBboxRequest(
		signal,
		bbox,
		fetchLayerId,
		projectionCode
	)
}
