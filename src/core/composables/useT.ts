import i18next from 'i18next'
import { ref, onMounted, onUnmounted, type Ref } from 'vue'

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
