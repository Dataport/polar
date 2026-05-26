import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useContextMenuStore = defineStore('contextMenu', () => {
	const buttons = ref([])
	const show = ref(false)

	// TODO: Implement me
	function addEntry() {}
	// TODO: Implement me
	function removeEntry() {}

	return {
		buttons,
		show,
		addEntry,
		removeEntry,
	}
})
