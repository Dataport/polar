import Vue from 'vue'

/*
 * Albeit the map will render without this in Firefox, it won't in Chromium-
 * based browsers. The map reports "No map visible because the map
 * container's width or height are 0.". However, if updating the map's size
 * after letting all other tasks in callback queue execute, the DOM is
 * prepared, and we're good to go.
 *
 * For some reason, we'll have to wait two callback queues sometimes.
 * The waiting is arbitrarily limited to 100 queues before an error is shown.
 */
export const updateSizeOnReady = (instance: Vue) => {
  let attemptCounter = 0
  const intervalId = setInterval(() => {
    const size = instance.$store.getters.map.getSize()
    if (attemptCounter++ < 100 && (size[0] === 0 || size[1] === 0)) {
      instance.$store.getters.map.updateSize()
    } else if (attemptCounter === 100) {
      console.error(
        `The POLAR map client could not update its size. The map is probably invisible due to having 0 width or 0 height. This might be a CSS issue – please check the wrapper's size.`
      )
    } else {
      // OL prints warnings – add this log to reduce confusion
      // eslint-disable-next-line no-console
      console.log(`The map now has dimensions and can be rendered.`)
      clearInterval(intervalId)
    }
  }, 0)
}
