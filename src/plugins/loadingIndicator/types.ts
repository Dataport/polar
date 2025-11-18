import type { PluginOptions } from '@/core'

export const PluginId = 'loadingIndicator'

export type LoaderStyles =
	| 'CircleLoader'
	| 'BasicLoader'
	| 'RingLoader'
	| 'RollerLoader'
	| 'SpinnerLoader'
	| 'kern-loader'

export interface LoadingIndicatorOptions extends PluginOptions {
	/**
	 * Choose between different loader styles.
	 *
	 * Supported options:
	 * <table align="center">
	 *   <tr align="center">
	 *     <td width="33%" align="center"><img src="./assets/KernLoader.gif" alt="kern-loader" height="120px" style="object-fit: none;"><div>kern-loader</div></td>
	 *     <td width="33%" align="center"><img src="./assets/BasicLoader.gif" alt="BasicLoader" height="120px" style="object-fit: contain;"><div>BasicLoader</div></td>
	 *     <td width="33%" align="center"><img src="./assets/RingLoader.gif" alt="RingLoader" height="120px" style="object-fit: contain;"><div>RingLoader</div></td>
	 *   </tr>
	 *   <tr align="center">
	 *     <td width="33%" align="center"><img src="./assets/RollerLoader.gif" alt="RollerLoader" height="120px" style="object-fit: contain;"><div>RollerLoader</div></td>
	 *     <td width="33%" align="center"><img src="./assets/CircleLoader.gif" alt="CircleLoader" height="120px" style="object-fit: contain;"><div>CircleLoader</div></td>
	 *     <td width="33%" align="center"><img src="./assets/SpinnerLoader.gif" alt="SpinnerLoader" height="120px" style="object-fit: contain;"><div>SpinnerLoader</div></td>
	 *   </tr>
	 * </table>
	 *
	 * It is also possible to choose `null` as a `loaderStyle` to hide the loader.
	 *
	 * @defaultValue `'kern-loader'`
	 * @privateRemarks
	 * TODO(dopenguin): Add PolarLoader that includes the Logo
	 */
	loaderStyle?: LoaderStyles | null
}
