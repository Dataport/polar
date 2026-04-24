/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/export/store
 */
/* eslint-enable tsdoc/syntax */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useCoreStore } from '@/core/stores'

import type { ExportPluginOptions, ExportFormat } from './types'

import { EXPORT_FORMATS } from './types'
import { convertCanvasToBase64 } from './utils/convertCanvasToBase64'
import { convertToPdf } from './utils/convertToPdf'
import { downloadAsImage } from './utils/downloadAsImage'
import { getCanvasFromMap } from './utils/getCanvasFromMap'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for export functionality.
 */
/* eslint-enable tsdoc/syntax */
export const useExportStore = defineStore('plugins/export', () => {
	const coreStore = useCoreStore()
	const exportedMap = ref('')

	const configuration = computed(
		() => (coreStore.configuration['export'] || {}) as ExportPluginOptions
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
	const singleExport = computed(() =>
		filteredExportOptions.value.length === 1
			? filteredExportOptions.value[0]
			: null
	)

	function exportAs(type: ExportFormat) {
		if (!filteredExportOptions.value.includes(type)) {
			console.warn(`@polar/plugin-export: Export format not allowed: ${type}`)
			return
		}
		const map = coreStore.map
		const canvas = getCanvasFromMap(map)

		const base64String = convertCanvasToBase64(canvas, type)
		if (!base64String) {
			console.warn(
				'@polar/plugin-export: Failed to convert canvas to base64 string.'
			)
			return
		}
		exportedMap.value = base64String
		if (type === 'pdf') {
			const { pdfSrc, jsPdf } = convertToPdf(
				base64String,
				canvas.width,
				canvas.height
			)
			exportedMap.value = pdfSrc

			if (download.value) {
				jsPdf.save('map.pdf')
			}
		} else {
			if (download.value) {
				downloadAsImage(base64String, type)
			}
		}
	}

	return {
		/** @internal */
		renderType,

		/** @internal */
		filteredExportOptions,

		/** @internal */
		download,

		/** @internal */
		singleExport,

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
