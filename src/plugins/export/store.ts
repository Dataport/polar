/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/exporter/store
 */
/* eslint-enable tsdoc/syntax */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useCoreStore } from '@/core/stores'

import type { ExportPluginOptions, ExportFormat } from './types'

import { EXPORT_FORMATS } from './types'
import { convertCanvasToBase64 } from './utils/convertCanvasToBase64'
import { getCanvasFromMap } from './utils/getCanvasFromMap'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for export functionality.
 */
/* eslint-enable tsdoc/syntax */
export const useExportStore = defineStore('plugins/exporter', () => {
	const coreStore = useCoreStore()
	const selectedExportFormat = ref<ExportFormat>()
	const exportedMap = ref('')

	const configuration = computed(
		() => (coreStore.configuration['exporter'] || {}) as ExportPluginOptions
	)
	const download = computed(() => configuration.value.download || false)

	const renderType = computed(
		() => configuration.value.renderType || 'independent'
	)

	const filteredExportOptions = computed(() => {
		const configured = configuration.value.options || ['png']
		const configuredArray = Array.isArray(configured)
			? configured
			: [configured]

		return configuredArray.filter((opt) => EXPORT_FORMATS.includes(opt))
	})

	function exportAs(type: ExportFormat) {
		if (!filteredExportOptions.value.includes(type)) {
			console.warn(`Exporter: Export format not allowed: ${type}`)
			return
		}
		const map = coreStore.map
		const canvas = getCanvasFromMap(map)

		const base64String = convertCanvasToBase64(canvas, type)
		exportedMap.value = base64String

		if (download.value) {
			const link = document.createElement('a')
			link.href = base64String
			link.download = `map.${type}`
			link.style.display = 'none'
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		}
	}

	return {
		/** @internal */
		renderType,

		/** @internal */
		filteredExportOptions,

		/** @internal */
		selectedExportFormat,

		/** @internal */
		download,

		/**
		 * Initiates the export process for the specified format.
		 */
		exportAs,

		/**
		 * Holds the exported map as a base64-encoded string after export.
		 */
		exportedMap,
	}
})
