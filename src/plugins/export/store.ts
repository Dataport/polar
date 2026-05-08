/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/export/store
 */
/* eslint-enable tsdoc/syntax */

import { t } from 'i18next'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useCoreStore } from '@/core/stores'
import { notifyUser } from '@/lib/notifyUser'

import type { ExportFormat } from './types'

import { EXPORT_FORMATS } from './types'
import { convertToPdf } from './utils/convertToPdf'
import { CrossOriginMonkey } from './utils/CrossOriginMonkey'
import { downloadAsImage } from './utils/downloadAsImage'
import { getCanvasFromMap } from './utils/getCanvasFromMap'
import type { Interaction } from 'ol/interaction'
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

	const configuration = computed(() => coreStore.configuration.export ?? {})
	const download = computed(() => configuration.value.download ?? false)
	const layoutTag = computed(() => configuration.value.layoutTag)
	const availableFormats = computed(() => {
		const validFormats =
			configuration.value.formats?.filter((format) => {
				const valid = EXPORT_FORMATS.includes(format)

				if (!valid) {
					console.warn(
						`Erroneous export.formats entry '${format}' configured. It was filtered out. Please verify configuration. Allowed formats are: '${EXPORT_FORMATS.join("', '")}'.`
					)
				}

				return valid
			}) ?? ([] as ExportFormat[])

		return validFormats.length > 0 ? validFormats : (['png'] as ExportFormat[])
	})

	function exportAs(type: ExportFormat) {
		let pausedInteractions: Array<Interaction> = []

		try {
			if (!availableFormats.value.includes(type)) {
				throw new Error(`Export format not allowed: "${type}"`)
			}

			pausedInteractions = coreStore.map
				.getInteractions()
				.getArray()
				.filter((interaction) => interaction.getActive())

			pausedInteractions.forEach((interaction) => {
				interaction.setActive(false)
			})

			const map = coreStore.map
			const canvas = getCanvasFromMap(map)
			const base64String = canvas.toDataURL(
				type === 'png' ? 'image/png' : 'image/jpeg'
			)

			if (!base64String) {
				throw new Error('Failed to convert canvas to base64 string.')
			}

			if (type === 'pdf') {
				const { pdfSrc, jsPdf } = convertToPdf(
					base64String,
					canvas.width,
					canvas.height
				)
				exportedMap.value = pdfSrc

				if (download.value) {
					jsPdf.save('polar-map.pdf')
				}
			} else {
				exportedMap.value = base64String
				if (download.value) {
					downloadAsImage(base64String, type)
				}
			}
		} catch (error) {
			console.error(error)
			notifyUser('error', () =>
				t(($) => $.error, {
					ns: 'export',
				})
			)
			throw error
		} finally {
			pausedInteractions.forEach((interaction) => {
				interaction.setActive(true)
			})
		}
	}

	const monkey = new CrossOriginMonkey()

	function setupPlugin() {
		monkey.startBusiness(coreStore.map)
	}

	function teardownPlugin() {
		monkey.stopBusiness(coreStore.map)
	}

	return {
		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,

		/**
		 * Configured valid formats or, if none are given or all are invalid, fallback.
		 * @alpha
		 */
		availableFormats,

		/**
		 * Configured layout tag, if given.
		 * @alpha
		 */
		layoutTag,

		/**
		 * Initiates the export process for the specified format. Throws with an
		 * error description if something goes wrong.
		 */
		exportAs,

		/**
		 * Holds the exported map as a base64-encoded string after export.
		 * Content depends on chosen export format. Initially `''`.
		 */
		exportedMap,
	}
})
