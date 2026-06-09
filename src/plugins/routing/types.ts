import type { PluginOptions } from '@/core'

export const PluginId = 'routing'

export type SelectableTravelMode =
	| 'driving-car'
	| 'driving-hgv'
	| 'cycling-regular'
	| 'foot-walking'
	| 'wheelchair'

export interface RoutingPluginOptions extends PluginOptions {
	/**
	 * The type of routing service to be used.
	 * Currently, only the [OpenRouteService](https://openrouteservice.org/) (`'ors'`) is implemented.
	 */
	type: 'ors'

	/**
	 * The url of the routing service to be used.
	 */
	url: string

	/**
	 * The API key to access the routing service.
	 * Required for OpenRouteService if not already covered by the given {@link RoutingPluginOptions.url | `url`}.
	 */
	apiKey?: string

	/**
	 * Defines whether the user can choose their route preference.
	 *
	 * @defaultValue `false`
	 */
	displayPreferences?: boolean

	/**
	 * Defines whether the user can select types of routes to avoid.
	 *
	 * @defaultValue `false`
	 */
	displayRouteTypesToAvoid?: boolean

	/**
	 * List of available travel modes.
	 *
	 * @defaultValue `['driving-car', 'cycling-regular', 'foot-walking']`
	 */
	selectableTravelModes?: SelectableTravelMode[]
}
