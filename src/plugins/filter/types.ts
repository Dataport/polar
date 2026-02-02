import type { Icon, PluginOptions } from '@/core'

/**
 * Plugin identifier.
 */
export const PluginId = 'filter'

/**
 * A single value of a category-based filter configuration for a layer.
 *
 * @example
 * ```ts
 * {
 * 	value: 'home',
 * 	icon: 'kern-icon--home',
 * }
 * ```
 */
export interface CategoryValue {
	/**
	 * Technical value of a feature property.
	 */
	value: string

	/**
	 * An icon that is assigned to the value for filtering.
	 */
	icon?: Icon
}

/**
 * Category-based filter configuration for a layer.
 *
 * @example
 * ```ts
 * {
 * 	targetProperty: 'favouriteIceCream',
 * 	knownValues: ['chocolate', 'vanilla', 'strawberry'],
 * 	selectAll: true,
 * }
 * ```
 *
 * This example configuration will add these checkboxes:
 *
 * ```
 * ▢ De-/select all
 * ▢ Chocolate
 * ▢ Vanilla
 * ▢ Strawberry
 * ```
 */
export interface Category {
	/**
	 * Known values for the target property to filter by.
	 * Values not listed here cannot be filtered.
	 *
	 * If using `string` instead of `CategoryValue`, the string is interpreted as the `value` key.
	 *
	 * @remarks
	 * The values listed here should be localized:
	 * ```ts
	 * filter: {
	 * 	layer: {
	 * 		haus: {
	 * 			category: {
	 * 				houseType: {
	 * 					knownValue: {
	 * 						shed: 'Schuppen',
	 * 						mansion: 'Villa',
	 * 						fortress: 'Festung',
	 * 					},
	 * 				},
	 * 			},
	 * 		},
	 * 	},
	 * }
	 * ```
	 *
	 * @example ['shed', 'mansion', 'fortress']
	 */
	knownValues: (CategoryValue | string)[]

	/**
	 * Key of the feature property to filter by.
	 *
	 * @remarks
	 * This value can be localized:
	 * ```ts
	 * filter: {
	 * 	layer: {
	 * 		haus: {
	 * 			category: {
	 * 				houseType: {
	 * 					title: 'Art des Hauses',
	 * 				},
	 * 			},
	 * 		},
	 * 	},
	 * }
	 * ```
	 *
	 * @example `'houseType'`
	 */
	targetProperty: string

	/**
	 * If `true`, a checkbox is provided to enable or disable all `knownValues` at once.
	 *
	 * @example true
	 * @defaultValue false
	 */
	selectAll?: boolean
}

/**
 * Time-based filter configuration for a layer.
 *
 * @remarks
 * Of all time restrictions, at most one can be selected at any time.
 * The produced options are selectable by radio buttons.
 *
 * @example
 * ```ts
 * {
 * 	targetProperty: 'start',
 * 	pattern: 'YYYYMMDD',
 * 	last: [
 * 		{
 * 			amounts: [7, 30],
 * 		},
 * 	],
 * 	next: [
 * 		{
 * 			amounts: [7, 30],
 * 		},
 * 	],
 * 	freeSelection: {
 * 		now: 'until',
 * 	},
 * }
 * ```
 */
export interface Time {
	/**
	 * Key of the feature property to filter by.
	 */
	targetProperty: string

	/**
	 * Defines if the time filter is freely selectable by the user.
	 * If set to `'until'`, every time range until the current day (inclusive) can be selected.
	 * If set to `'from'`, every time range from the current day (inclusive) can be selected.
	 * If not set, this feature is disabled.
	 *
	 * @example
	 * The configuration `'until'` will add this option:
	 * ```ts
	 * ◯ Choose time frame
	 *   From ▒▒▒▒▒▒▒▒▒▒▒ // clicking input opens a selector restricted *until* today
	 *   To   ▇▇▇▇▇▇▇▇▇▇▇ // clicking input opens a selector restricted *until* today
	 * ```
	 */
	freeSelection?: 'until' | 'from'

	/**
	 * Configuration for preset time ranges in the past, measured in days.
	 * A configuration of `[5, 10]` adds the options `Last 5 days` and `Last 10 days`.
	 *
	 * @example
	 * For the configuration `[3, 7]`, this will yield the following options:
	 * ```
	 * ◯ Last 3 days
	 * ◯ Last 7 days
	 * ```
	 *
	 * @remarks
	 * The selections will always include full days, and additionally the current day.
	 * Due to this, the time frame of "last 7 days" is actually 8*24h long.
	 * This seems unexpected at first, but follows intuition – if it's Monday and a user filters to the "last seven days", they would expect to fully see last week's Monday, but also features from that day's morning.
	 */
	last?: number[]

	/**
	 * Configuration for preset time ranges in the future.
	 * A configuration of `[5, 10]` adds the options `Next 5 days` and `Next 10 days`.
	 *
	 * @example
	 * For the configuration `[3, 7]`, this will yield the following options:
	 * ```
	 * ◯ Next 3 days
	 * ◯ Next 7 days
	 * ```
	 *
	 * @remarks
	 * The selections will always include full days, and additionally the current day.
	 * Due to this, the time frame of "next 7 days" is actually 8*24h long.
	 * This seems unexpected at first, but follows intuition – if it's Monday and a user filters to the "next seven days", they would expect to fully see next week's Monday, but also features from that day's morning.
	 */
	next?: number[]

	/**
	 * A pattern that specifies the date format used in the feature properties.
	 * The pattern definition allows the following tokens:
	 * - `YYYY`: 4-digit year
	 * - `MM`: 2-digit month (01-12)
	 * - `DD`: 2-digit day of month (01-31)
	 * - `-`: ignored character
	 *
	 * @privateRemarks
	 * All characters that are not tokens are handled as ignored characters.
	 * This behavior may change in future versions without a breaking change!
	 *
	 * @example For the pattern `'--YYYYDD-MM'`, the value `'ML197001-04'` will be interpreted as 1970-04-01 / Apr 1, 1970.
	 * @defaultValue 'YYYY-MM-DD'
	 */
	pattern?: string
}

/**
 * Filter configuration for a layer.
 *
 * @example
 * ```ts
 * {
 * 	categories: [
 * 		{
 * 			targetProperty: 'favouriteIceCream',
 * 			knownValues: ['chocolate', 'vanilla', 'strawberry'],
 * 			selectAll: true,
 * 		},
 * 	],
 * 	time: {
 * 		targetProperty: 'start',
 * 		pattern: 'YYYYMMDD',
 * 	},
 * }
 * ```
 */
export interface FilterConfiguration {
	/**
	 * A definition of different categories to filter features based on their properties.
	 */
	categories?: Category[]

	/**
	 * Filter features based on a time property.
	 */
	time?: Time
}

/**
 * Plugin options for filter plugin.
 *
 * @example
 * ```ts
 * {
 * 	layers: {
 * 		'1234': {
 * 			categories: [
 * 				{
 * 					selectAll: true,
 * 					targetProperty: 'buildingType',
 * 					knownValues: ['shed', 'mansion', 'fortress']
 * 				},
 * 				{
 * 					selectAll: false,
 * 					targetProperty: 'lightbulb',
 * 					knownValues: ['on', 'off']
 * 				}
 * 			],
 * 			time: {
 * 				targetProperty: 'lastAccident',
 * 				last: [
 * 					{
 * 						amounts: [7, 30],
 * 						unit: 'days',
 * 					},
 * 				],
 * 				freeSelection: {
 * 					unit: 'days',
 * 					now: 'until'
 * 				},
 * 				pattern: 'YYYYDDMM'
 * 			}
 * 		}
 * 	}
 * }
 * ```
 */
export interface FilterPluginOptions extends PluginOptions {
	/**
	 * Maps a layer ID to its filter configuration.
	 */
	layers: Record<string, FilterConfiguration>
}

/**
 * Filter state for a layer.
 * This represents the filters enabled by the user.
 */
export interface FilterState {
	/**
	 * For each key representing a property's key, only values listed as keys with a truthy value in the value record are visible.
	 *
	 * @example
	 * The following example allows the property `houseType` to have the value `shed` only.
	 * ```ts
	 * {
	 * 	houseType: { shed: true, house: false },
	 * }
	 * ```
	 */
	knownValues?: Record<string, Record<string, boolean>>

	/**
	 * For each key representing a property's key, only values starting after `from` and ending until `until` are visible.
	 * The interpretation of the date is done using the `pattern` as described in `Time.pattern`.
	 *
	 * @example
	 * The following example allows the property `time` (ISO date) to be in 2025.
	 * ```ts
	 * {
	 * 	time: {
	 * 		from: new Date('2025-01-01'),
	 * 		to: new Date('2025-12-31'),
	 * 		pattern: 'YYYY-MM-DD',
	 * 	},
	 * }
	 * ```
	 */
	timeSpan?: Record<string, { from: Date; until: Date; pattern: string }>
}
