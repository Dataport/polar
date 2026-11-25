import type {
	MapConfiguration,
	MasterportalApiServiceRegister,
} from '../../types'

import { register } from '../..'
import { fetchServiceRegister } from '../fetchServiceRegister'

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
	const map = document.createElement('polar-map')
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
 * ## Additional icons
 *
 * POLAR only ships the KERN extra icons it uses itself. If your client defines icons of its own (e.g. via `icon` in a
 * plugin configuration), it is recommended to generate a stylesheet for them with
 * {@link https://www.npmjs.com/package/vite-plugin-kern-extra-icons | `vite-plugin-kern-extra-icons`} and add it to the
 * map's shadowRoot. If your client defines no icons itself, this is not necessary.
 *
 * Register the plugin in your Vite configuration:
 * ```ts
 * import { normalizePath } from 'vite'
 * import kernExtraIcons from 'vite-plugin-kern-extra-icons'
 *
 * // within `plugins`
 * kernExtraIcons({
 * 	cssLayer: 'kern-ux-icons',
 * 	// When using npm linked @polar/polar, it resolves outside `node_modules` and would be scanned as well.
 * 	ignoreFilename: (name) =>
 * 		!name.startsWith(`${normalizePath(import.meta.dirname)}/`),
 * }),
 * ```
 *
 * For TypeScript, add `vite-plugin-kern-extra-icons/client` to `compilerOptions.types` in your `tsconfig.json`.
 *
 * Then add the generated stylesheet to the map element returned by `createMap`:
 * ```ts
 * import kernExtraIcons from 'virtual:kern-extra-icons'
 *
 * const client = await createMap(containerId, mapConfiguration, serviceRegister)
 * client.shadowRoot?.adoptedStyleSheets.push(kernExtraIcons)
 * ```
 *
 * ## Teardown
 *
 * In general, your calls to our `subscribe` method should also be cleaned up to avoid leaks.
 * This method returns a function that, when called, unsubscribes from the watched parameter.
 *
 * Note that most frameworks will handle DOM regeneration on rerenders themselves.
 * Should you need to clean up the DOM for arbitrary reasons yourself, this snippet may come in handy:
 * ```ts
 * const polarstern = document.getElementById('polarstern-wrapper')
 * const stellamaris = document.createElement('div')
 * stellamaris.id = 'polarstern'
 * polarstern?.parentElement?.replaceChild(stellamaris, polarstern)
 * ```
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
	container.classList.forEach((c) => {
		map.classList.add(c)
	})
	container.replaceWith(map)
	return map
}
