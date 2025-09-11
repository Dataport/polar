import { rawLayerList } from '@masterportal/masterportalapi'

export async function loadCapabilities(
	id: string,
	previousCapabilities?: string | null
): Promise<string | null> {
	if (typeof previousCapabilities === 'string') {
		console.warn(
			`Re-fired loadCapabilities on id '${id}' albeit the GetCapabilities have already been successfully fetched. No re-fetch will occur.`
		)
		return new Promise((resolve) => {
			resolve(null)
		})
	}

	const service = rawLayerList.getLayerWhere({ id })
	if (!service || !service.url || !service.version || !service.typ) {
		console.error(`Missing data for service '${service}' with id '${id}'.`)
		return new Promise((resolve) => {
			resolve(null)
		})
	}

	const capabilitiesUrl = `${service.url}?service=${service.typ}&version=${service.version}&request=GetCapabilities`

	try {
		const response = await fetch(capabilitiesUrl)
		return await response.text()
	} catch (e: unknown) {
		console.error(
			`Capabilities from ${capabilitiesUrl} could not be fetched.`,
			e
		)
		return null
	}
}
