import {
	type MapConfiguration,
	type MasterportalApiServiceRegister,
	type PluginId,
	type PolarContainer,
	type PluginContainer,
	fetchServiceRegister,
} from '@/core'
import {
	addPlugins as coreAddPlugins,
	createMap as coreCreateMap,
} from '@/core'
import AddressSearch from '@/plugins/addressSearch'
import Fullscreen from '@/plugins/fullscreen'
import GeoLocation from '@/plugins/geoLocation'
import IconMenu, { type Menu } from '@/plugins/iconMenu'
import LayerChooser from '@/plugins/layerChooser'
import LoadingIndicator from '@/plugins/loadingIndicator'
import Pins from '@/plugins/pins'
import ReverseGeocoder from '@/plugins/reverseGeocoder'
import Scale from '@/plugins/scale'
import Toast from '@/plugins/toast'

function addPlugins(map: typeof PolarContainer, enabledPlugins: PluginId[]) {
	const iconMenu =
		enabledPlugins.includes('iconMenu') &&
		IconMenu({
			displayComponent: true,
			layoutTag: 'TOP_RIGHT',
			menus: [
				[
					enabledPlugins.includes('fullscreen') && {
						plugin: Fullscreen({ renderType: 'iconMenu' }),
					},
					enabledPlugins.includes('layerChooser') && {
						plugin: LayerChooser({}),
						icon: 'kern-icon-fill--layers',
					},
					enabledPlugins.includes('geoLocation') && {
						plugin: GeoLocation({ renderType: 'iconMenu' }),
					},
				].filter((x) => x) as Menu[],
			],
		})

	coreAddPlugins(
		map,
		[
			iconMenu,
			enabledPlugins.includes('addressSearch') &&
				AddressSearch({
					displayComponent: true,
					layoutTag: 'TOP_LEFT',
					searchMethods: [],
				}),
			enabledPlugins.includes('pins') && Pins({}),
			enabledPlugins.includes('loadingIndicator') &&
				LoadingIndicator({
					displayComponent: true,
					layoutTag: 'MIDDLE_MIDDLE',
				}),
			enabledPlugins.includes('reverseGeocoder') &&
				ReverseGeocoder({ url: '' }),
			enabledPlugins.includes('scale') &&
				Scale({
					displayComponent: true,
					layoutTag: 'BOTTOM_RIGHT',
				}),
			enabledPlugins.includes('toast') &&
				Toast({
					displayComponent: true,
					layoutTag: 'BOTTOM_MIDDLE',
				}),
		].filter((x) => x) as PluginContainer[]
	)
}

/**
 * Creates a map element that has the {@link enabledPlugins} included in a defaulted combination.
 *
 *
 * See {@link coreCreateMap | createMap} and {@link coreAddPlugins | addPlugins} for general information.
 *
 * @param containerId - ID of the container the map will render itself in.
 * @param serviceRegister - Service register given as an array, or a URL to fetch this from.
 * @param mapConfiguration - Configuration options.
 * @param enabledPlugins - IDs of the plugins that should be enabled. Defaults to none. Note that the plugins with the
 * 												ids 'fullscreen', 'geoLocation' and 'layerChooser' are added to the iconMenu.
 * 												Using either of those requires the iconMenu to be added as well.
 * @param modifyServiceRegister - Optionally modify the serviceRegister. This may be useful if a pre-existing register is used.
 *
 * @example
 * The container may look like the following with `polarstern` being the {@link containerId}.
 * Note that the container has to have its size defined.
 *
 * ```html
 * <div
 * 	style="
 * 		width: 680px;
 * 		height: 420px;
 * 		position: relative;
 * 	"
 * 	id="polarstern"
 * >
 * 	<!-- Optional, may use if your page does not have its own <noscript> information -->
 * 	<noscript>Please use a browser with active JavaScript to use the map client.</noscript>
 * </div>
 * ```
 *
 * @remarks
 * For information regarding teardown in e.g. SPAs, see the {@link coreCreateMap | teardown section in `createMap`}.
 */
export async function createMap(
	containerId: string,
	serviceRegister: MasterportalApiServiceRegister | string,
	mapConfiguration: MapConfiguration,
	enabledPlugins: PluginId[] = [],
	modifyServiceRegister: (
		register: MasterportalApiServiceRegister
	) => MasterportalApiServiceRegister = (x) => x
): Promise<typeof PolarContainer> {
	let register = serviceRegister
	if (typeof serviceRegister === 'string') {
		register = await fetchServiceRegister(serviceRegister)
	}
	register = modifyServiceRegister(register as MasterportalApiServiceRegister)

	const map: typeof PolarContainer = await coreCreateMap(
		containerId,
		mapConfiguration,
		register
	)
	addPlugins(map, enabledPlugins)

	return map
}

export default { createMap }
