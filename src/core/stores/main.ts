import type { Feature, Map as OlMap } from 'ol'
import type { Point } from 'ol/geom'
import type {
	ColorScheme,
	MapConfigurationIncludingDefaults,
	MasterportalApiServiceRegister,
	PluginId,
} from '../types'

import { rawLayerList } from '@masterportal/masterportalapi'
import { toMerged } from 'es-toolkit'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, shallowRef, watch } from 'vue'

import { addInterceptor } from '../utils/addInterceptor'
import { SMALL_DISPLAY_HEIGHT, SMALL_DISPLAY_WIDTH } from '../utils/constants'
import defaults from '../utils/defaults'

export const useMainStore = defineStore('main', () => {
	const colorScheme = ref<ColorScheme>('system')
	const configuration = ref<MapConfigurationIncludingDefaults>(
		toMerged(
			{
				layers: [],
				startCenter: [0, 0],
			},
			defaults
		)
	)
	const language = ref('')
	const lightElement = ref<HTMLElement | null>(null)
	const map = shallowRef({} as OlMap)
	const serviceRegister = ref<MasterportalApiServiceRegister>([])
	const shadowRoot = ref<ShadowRoot | null>(null)

	const layout = computed(() => configuration.value.layout ?? 'nineRegions')

	// TODO(dopenguin): Both will possibly be updated with different breakpoints -> Breakpoints are e.g. not valid on newer devices
	const clientHeight = ref(0)
	const clientWidth = ref(0)
	const hasSmallHeight = computed(
		() => clientHeight.value <= SMALL_DISPLAY_HEIGHT
	)
	const hasSmallWidth = computed(() => clientWidth.value <= SMALL_DISPLAY_WIDTH)
	const hasWindowSize = computed(
		() =>
			window.innerHeight === clientHeight.value &&
			window.innerWidth === clientWidth.value
	)
	const deviceIsHorizontal = computed(
		() => hasSmallHeight.value && hasWindowSize.value
	)

	const hasSmallDisplay = ref(false)
	function updateHasSmallDisplay() {
		hasSmallDisplay.value =
			window.innerHeight <= SMALL_DISPLAY_HEIGHT ||
			window.innerWidth <= SMALL_DISPLAY_WIDTH
	}

	const oidcToken = ref('')
	watch(
		() => configuration.value.secureServiceUrlRegex,
		(urlRegex) => {
			if (urlRegex) {
				addInterceptor(
					urlRegex,
					() => new Headers([['Authorization', `Bearer ${oidcToken.value}`]])
				)
			}
		}
	)

	const zoom = ref(0)

	const center = ref([0, 0])
	function centerOnFeature(feature: Feature) {
		center.value = (feature.getGeometry() as Point).getCoordinates()
	}

	function getLayerMapConfiguration(layerId: string) {
		const polar = configuration.value.layers.find(
			(layer) => layer.id === layerId
		)
		const register = rawLayerList.getLayerWhere({ id: layerId })
		if (!polar || !register) {
			return null
		}
		return { ...register, ...polar } as typeof polar
	}

	// TODO: Check if this works as expected in all combinations when draw is migrated
	const maskedInteractions = ref(
		new Map<string, { pluginId: PluginId; teardown: () => void }>()
	)
	function maskInteraction(
		pluginId: PluginId,
		interaction: string,
		setup: () => void,
		teardown: () => void
	) {
		if (maskedInteractions.value.has(interaction)) {
			maskedInteractions.value.get(interaction)?.teardown()
		}
		maskedInteractions.value.set(interaction, { pluginId, teardown })
		setup()
	}
	function unmaskInteraction(pluginId: PluginId, interaction: string) {
		if (maskedInteractions.value.get(interaction)?.pluginId === pluginId) {
			maskedInteractions.value.get(interaction)?.teardown()
			maskedInteractions.value.delete(interaction)
		}
	}
	function isInteractionMasked(interaction: string) {
		return maskedInteractions.value.has(interaction)
	}

	return {
		// State
		colorScheme,
		configuration,
		clientHeight,
		clientWidth,
		hasSmallDisplay,
		language,
		lightElement,
		map,
		oidcToken,
		serviceRegister,
		shadowRoot,
		center,
		zoom,
		// Getters
		layout,
		hasSmallHeight,
		hasSmallWidth,
		hasWindowSize,
		deviceIsHorizontal,
		// Actions
		centerOnFeature,
		updateHasSmallDisplay,
		getLayerMapConfiguration,
		maskInteraction,
		unmaskInteraction,
		isInteractionMasked,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
}

if (import.meta.vitest) {
	const { vi, expect, test: _test } = import.meta.vitest
	const { createPinia, setActivePinia } = await import('pinia')

	/* eslint-disable no-empty-pattern */
	const test = _test.extend<{
		store: ReturnType<typeof useMainStore>
	}>({
		store: async ({}, use) => {
			setActivePinia(createPinia())
			await use(useMainStore())
		},
	})
	/* eslint-enable no-empty-pattern */

	test('interactions can be masked and unmasked', ({ store }) => {
		const pluginId = 'external-test-plugin'
		const interaction = 'click'
		const setup = vi.fn()
		const teardown = vi.fn()

		expect(store.isInteractionMasked(interaction)).toBe(false)

		store.maskInteraction(pluginId, interaction, setup, teardown)
		expect(store.isInteractionMasked(interaction)).toBe(true)
		expect(setup).toHaveBeenCalledTimes(1)
		expect(teardown).toHaveBeenCalledTimes(0)

		store.unmaskInteraction(pluginId, interaction)
		expect(store.isInteractionMasked(interaction)).toBe(false)
		expect(setup).toHaveBeenCalledTimes(1)
		expect(teardown).toHaveBeenCalledTimes(1)
	})

	test('masking the same interaction twice tears down the previous mask', ({
		store,
	}) => {
		const interaction = 'click'
		const firstPluginId = 'external-test-plugin'
		const firstSetup = vi.fn()
		const firstTeardown = vi.fn()
		const secondPluginId = 'external-second-test-plugin'
		const secondSetup = vi.fn()
		const secondTeardown = vi.fn()

		expect(store.isInteractionMasked(interaction)).toBe(false)

		store.maskInteraction(firstPluginId, interaction, firstSetup, firstTeardown)
		expect(store.isInteractionMasked(interaction)).toBe(true)
		expect(firstSetup).toHaveBeenCalledTimes(1)
		expect(firstTeardown).toHaveBeenCalledTimes(0)

		store.maskInteraction(
			secondPluginId,
			interaction,
			secondSetup,
			secondTeardown
		)
		expect(store.isInteractionMasked(interaction)).toBe(true)
		expect(firstTeardown).toHaveBeenCalledTimes(1)
		expect(secondSetup).toHaveBeenCalledTimes(1)
		expect(secondTeardown).toHaveBeenCalledTimes(0)
	})
}
