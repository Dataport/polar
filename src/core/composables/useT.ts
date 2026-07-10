import type { Ref } from 'vue'

import i18next from 'i18next'
import { onMounted, onUnmounted, ref } from 'vue'

export function useT(translator: () => string): Ref<string> {
	const message = ref(translator())

	const onLanguageChanged = () => {
		message.value = translator()
	}

	onMounted(() => {
		i18next.on('languageChanged', onLanguageChanged)
	})
	onUnmounted(() => {
		i18next.off('languageChanged', onLanguageChanged)
	})

	return message
}
