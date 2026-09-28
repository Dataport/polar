/**
 * Since device dpi are not directly available, this common hack is applied to get the actual device dpi.
 * If dpi can not be inferred, 96 is returned as default value, and a warning is logged.
 * @returns The device dpi as subscribable reference
 */
import { throttle } from 'es-toolkit'
import { onScopeDispose, ref } from 'vue'

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

let claims = 0
const updateDpi = throttle(() => (dpi.value = getDpi()), 100)

export function useDpi() {
	if (claims === 0) {
		window.addEventListener('resize', updateDpi, { passive: true })
		window.addEventListener('orientationchange', updateDpi)
		window.visualViewport?.addEventListener('resize', updateDpi)
	}

	claims++

	onScopeDispose(function () {
		claims--

		if (claims === 0) {
			window.removeEventListener('resize', updateDpi)
			window.removeEventListener('orientationchange', updateDpi)
			window.visualViewport?.removeEventListener('resize', updateDpi)
		}
	})

	return { dpi }
}
