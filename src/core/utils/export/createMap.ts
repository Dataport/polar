import type {
	MapConfiguration,
	MasterportalApiServiceRegister,
} from '@/core/types'

import { fetchServiceRegister, register } from '@/core'

/**
 * Creates an HTML map element with a given configuration.
 *
 * Instead of calling this function, you may also create the element yourself.
 * Creating the element yourself yields benefits especially when you use a framework
 * that is more used to creating elements itself and adding properties to them.
 *
 * Remember to always call `register` first.
 *
 * @privateRemarks
 * In earlier versions of POLAR, this function did a lot of magic.
 * However, the magic moved to the custom element itself, therefore, you may create the element by yourself now.
 *
 * @param mapConfiguration - Configuration options.
 * @param serviceRegister - Service register.
 */
export function createMapElement(
	mapConfiguration: MapConfiguration,
	serviceRegister: MasterportalApiServiceRegister
) {
	// @ts-expect-error | We trust that the element is registered
	const map = document.createElement('polar-map') as typeof PolarContainer
	map.mapConfiguration = mapConfiguration
	map.serviceRegister = serviceRegister
	return map
}

/**
 * Creates an HTML map element with a given configuration and inserts this at a given ID.
 *
 * This is a convenience function that combines `register`, `createMap` and `fetchServiceRegister`.
 *
 * It inserts the map element by replacing the element with the given ID.
 * The ID and the classes of the container are transferred to the map element.
 *
 * @param mapConfiguration - Configuration options.
 * @param serviceRegister - Service register given as an array, or an URL to fetch this from.
 */
export async function createMap(
	containerId: string,
	mapConfiguration: MapConfiguration,
	serviceRegister: MasterportalApiServiceRegister | string
) {
	if (!customElements.get('polar-map')) {
		register()
	}

	if (typeof serviceRegister === 'string') {
		serviceRegister = await fetchServiceRegister(serviceRegister)
	}

	const map = createMapElement(mapConfiguration, serviceRegister)

	const container = document.getElementById(containerId)
	if (!container) {
		throw new Error(`Container with ID '${containerId}' not found`)
	}
	map.id = container.id
	container.classList.forEach((c) => map.classList.add(c))
	container.replaceWith(map as unknown as HTMLElement)
	return map
}
