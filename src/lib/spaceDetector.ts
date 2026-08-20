import type { ComputedRef, Ref } from 'vue'
import type { PlaceablePluginOptions } from '@/core'

import { computed } from 'vue'

import { useCoreStore } from '@/core/stores'

/**
 * .𖥔 ݁ ˖ִ🛸༄˖°.⋆⭒˚.⋆🔭👀 Yep, it's space.
 *
 * Composable strictly meant for usage with NineLayout.
 */
export const spaceDetector = (options: Ref<PlaceablePluginOptions>) => {
	const coreStore = useCoreStore()

	const spaceDirection: ComputedRef<'left' | 'right'> = computed(() =>
		(options.value.renderType === 'independent' ||
		typeof options.value.renderType === 'undefined'
			? options.value.layoutTag
			: coreStore.getPluginStore('iconMenu')?.layoutTag
		)?.includes('RIGHT')
			? 'left'
			: 'right'
	)

	return {
		/**
		 * Indicates in which direction tooltips, content boxes, etc. should unfold.
		 */
		spaceDirection,
	}
}
