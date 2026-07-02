import type { Feature, Map } from 'ol'
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

import { findLayer } from '@/lib/findLayer'

import { addInterceptor } from '../utils/addInterceptor'
import { SMALL_DISPLAY_HEIGHT, SMALL_DISPLAY_WIDTH } from '../utils/constants'
import defaults from '../utils/defaults'
import { teardownInteractions } from '../utils/map/updateDragAndZoomInteractions'

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
	const extent = ref([0, 0, 0, 0])
	const language = ref('')
	const lightElement = ref<HTMLElement | null>(null)
	const map = shallowRef({} as Map)
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

	function getLayer(layerId: string) {
		return findLayer(map.value, layerId)
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

	const maskedInteractions = ref(new globalThis.Map<string, PluginId>())
	function maskInteraction(pluginId: PluginId, interaction: string) {
		if (maskedInteractions.value.has(interaction)) {
			throw new Error(
				`Interaction "${interaction}" is already masked by plugin "${maskedInteractions.value.get(
					interaction
				)}"`
			)
		}
		maskedInteractions.value.set(interaction, pluginId)
	}
	function unmaskInteraction(pluginId: PluginId, interaction: string) {
		if (maskedInteractions.value.get(interaction) === pluginId) {
			maskedInteractions.value.delete(interaction)
		}
	}
	function isInteractionMasked(interaction: string) {
		return maskedInteractions.value.has(interaction)
	}

	function setup() {
		addEventListener('resize', updateHasSmallDisplay)
		updateHasSmallDisplay()
	}

	function teardown() {
		removeEventListener('resize', updateHasSmallDisplay)
		teardownInteractions()
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
		extent,
		zoom,
		// Getters
		layout,
		hasSmallHeight,
		hasSmallWidth,
		hasWindowSize,
		deviceIsHorizontal,
		// Actions
		centerOnFeature,
		getLayer,
		updateHasSmallDisplay,
		getLayerMapConfiguration,
		maskInteraction,
		unmaskInteraction,
		isInteractionMasked,
		setup,
		teardown,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
}

if (import.meta.vitest) {
	const { expect, test: _test } = import.meta.vitest
	const { createPinia, setActivePinia } = await import('pinia')

	/* eslint-disable no-empty-pattern */
	const test = _test.extend<{
		store: ReturnType<typeof useMainStore>
	}>({
		store: async ({}, use) => {
			setActivePinia(createPinia())
			const store = useMainStore()
			store.setup()
			await use(store)
			store.teardown()
		},
	})
	/* eslint-enable no-empty-pattern */

	test('Masking interactions works as expected', ({ store }) => {
		const pluginId = 'external-test-plugin'
		const interaction = 'click'

		expect(store.isInteractionMasked(interaction)).toBe(false)

		store.maskInteraction(pluginId, interaction)
		expect(store.isInteractionMasked(interaction)).toBe(true)

		store.unmaskInteraction(pluginId, interaction)
		expect(store.isInteractionMasked(interaction)).toBe(false)
	})

	test('Masking interactions twice fails', ({ store }) => {
		const pluginId = 'external-test-plugin'
		const interaction = 'click'

		expect(store.isInteractionMasked(interaction)).toBe(false)

		store.maskInteraction(pluginId, interaction)
		expect(store.isInteractionMasked(interaction)).toBe(true)

		expect(() => {
			store.maskInteraction(pluginId, interaction)
		}).toThrow()
	})
}
