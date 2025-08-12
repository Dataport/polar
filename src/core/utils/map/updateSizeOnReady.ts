import type { Map } from 'ol'

/**
 * Albeit the map will render without this in Firefox, it won't in Chromium-
 * based browsers. The map reports "No map visible because the map
 * container's width or height are 0.". However, if updating the map's size
 * after letting all other tasks in callback queue execute, the DOM is
 * prepared, and we're good to go.
 *
 * @privateRemarks
 * TODO(dopenguin): Check if this is still required for the icon menu
 *
 * For some reason, we'll have to wait two callback queues sometimes.
 * The waiting is arbitrarily limited to 100 queues before an error is shown.
 */
export async function updateSizeOnReady(map: Map) {
	await new Promise<void>((resolve, reject) => {
		let attemptCounter = 0
		const intervalId = setInterval(() => {
			const size = map.getSize()
			if (attemptCounter++ < 100 && (!size || size[0] === 0 || size[1] === 0)) {
				map.updateSize()
			} else if (attemptCounter === 100) {
				clearInterval(intervalId)
				reject(new Error('Could not update POLAR map client size'))
			} else {
				clearInterval(intervalId)
				resolve()
			}
		}, 0)
	})
}
