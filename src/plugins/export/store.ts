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

/**
 * Canvas von der Map extrahieren (ohne Controls)
 */
function getCanvasFromMap(map: any): HTMLCanvasElement {
	const viewport = map.getViewport() as HTMLElement
	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')

	if (!context) {
		throw new Error('2D context not available')
	}

	canvas.width = viewport.clientWidth
	canvas.height = viewport.clientHeight

	const layerCanvases = viewport.querySelectorAll('.ol-layer canvas')
	layerCanvases.forEach((layerCanvas) => {
		const canvas = layerCanvas as HTMLCanvasElement
		if (canvas.width > 0) {
			context.drawImage(canvas, 0, 0)
		}
	})

	return canvas
}

/**
 * Screenshot verarbeiten und herunterladen
 */
function handleScreenshot(canvas: HTMLCanvasElement, type: ExportFormat): void {
	const mimeType = type === 'png' ? 'image/png' : 'image/jpeg'
	canvas.toBlob((blob) => {
		if (!blob) {
			console.error('Exporter: Failed to create blob from canvas')
			return
		}
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = `map.${type}`
		link.style.display = 'none'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		URL.revokeObjectURL(url)
	}, mimeType)
}

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
	// TODO implement export as base64-encoded string
	const exportedMap = ref<string>('')

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
		// handleScreenshot(canvas, type)
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
