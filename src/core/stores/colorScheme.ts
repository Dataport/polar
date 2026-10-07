import type { ColorScheme } from '../types'

import { defineStore } from 'pinia'
import { computed, onScopeDispose, ref } from 'vue'

export const useColorSchemeStore = defineStore('colorScheme', () => {
	const colorScheme = ref<ColorScheme>('system')

	const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
	const preferredColorScheme = ref<ColorScheme>(
		mediaQueryList.matches ? 'dark' : 'light'
	)
	function updatePreferredColorScheme() {
		preferredColorScheme.value = mediaQueryList.matches ? 'dark' : 'light'
	}
	mediaQueryList.addEventListener('change', updatePreferredColorScheme)
	onScopeDispose(() => {
		mediaQueryList.removeEventListener('change', updatePreferredColorScheme)
	})

	const effectiveColorScheme = computed<Omit<ColorScheme, 'system'>>(() =>
		colorScheme.value === 'system'
			? preferredColorScheme.value
			: colorScheme.value
	)

	return {
		colorScheme,
		effectiveColorScheme,
	}
})
