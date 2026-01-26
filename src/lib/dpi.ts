/**
 * Since device dpi are not directly available, this common hack is applied to get the actual device dpi.
 * If dpi can not be inferred, 96 is returned as default value, and a warning is logged.
 * @returns The device dpi as subscribable reference
 */
import { throttle } from 'es-toolkit'
import { ref } from 'vue'

function getDpi(): number {
	let dpi = 96

	try {
		const dpiDiv = document.createElement('div')
		const body = document.body

		dpiDiv.id = 'programmatical-dpidiv'
		dpiDiv.setAttribute(
			'style',
			'position: absolute; height: 1in; width: 1in; top: -100%; left: -100%;'
		)
		body.appendChild(dpiDiv)

		dpi = dpiDiv.offsetWidth * (window.devicePixelRatio || 1)
		body.removeChild(dpiDiv)
	} catch (e) {
		console.error(e)
		console.warn(
			`Since the dpi could not be inferred, the default value ${dpi} will be used.`
		)
	}

	return dpi
}

/**
 * Current DPI value. Only updated while tokens are registered.
 */
const dpi = ref(getDpi())

const claims = new Set<symbol>()
const updateDpi = throttle(() => (dpi.value = getDpi()), 100)

/**
 * Use this method to announce an update requirement.
 * DPI will be updated as long as at least one token is registered.
 * @param dibs - unique usage token indicating update requirement
 */
const yoink = (dibs: symbol) => {
	if (claims.size === 0) {
		window.addEventListener('resize', updateDpi, { passive: true })
		window.addEventListener('orientationchange', updateDpi)
		window.visualViewport?.addEventListener('resize', updateDpi)
	}

	claims.add(dibs)
}

/**
 * Use this method to announce updates are no longer required.
 * DPI updates will stop if this was the last using token.
 * @param dibs - unique usage token indicating update requirement
 */
const yeet = (dibs: symbol) => {
	claims.delete(dibs)

	if (claims.size === 0) {
		window.removeEventListener('resize', updateDpi)
		window.removeEventListener('orientationchange', updateDpi)
		window.visualViewport?.removeEventListener('resize', updateDpi)
	}
}

export function useDpi() {
	return { dpi, yoink, yeet }
}
