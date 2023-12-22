const waitTime = 500
const maxAttempts = 10

/*
 * CSS code taken from vuetify@2. While most of the vuetify@2 CSS is pulled to
 * within the shadow, this is required on the outside to make it all work.
 * Comments are from CSS source.
 */
const makeContainerCss = (containerId: string) => `
#${containerId} {
  box-sizing: border-box;
  /* All browsers without overlaying scrollbars */
  -webkit-text-size-adjust: 100%;
  /* Prevent adjustments of font size after orientation changes in iOS */
  word-break: normal;
  -moz-tab-size: 4;
  tab-size: 4;
}

#${containerId} * {
  background-repeat: no-repeat;
  /* Set \`background-repeat: no-repeat\` to all elements and pseudo elements */
  box-sizing: inherit;
}
`

const buildShadowDom = (
  shadowHost: HTMLElement,
  containerId: string
): ShadowRoot => {
  const wrapper = document.createElement('div')
  wrapper.id = `${containerId}-wrapper`
  const style = document.createElement('style')
  style.innerHTML = makeContainerCss(containerId)

  shadowHost.parentElement?.insertBefore(wrapper, shadowHost)
  wrapper.appendChild(shadowHost)
  wrapper.appendChild(style)

  return shadowHost.attachShadow({ mode: 'open' })
}

export const makeShadowRoot = (containerId: string): Promise<ShadowRoot> =>
  new Promise((resolve, reject) => {
    let counter = 0
    const intervalId = setInterval(() => {
      const shadowHost = document.getElementById(containerId)

      if (!shadowHost) {
        if (counter >= maxAttempts) {
          clearInterval(intervalId)
          reject(
            new Error(`containerId "${containerId}" not found on website.
                        POLAR map client won't render.
                        Giving up after ${counter} attempts.`)
          )
          return
        }
        console.error(
          `containerId "${containerId}" not found on website.
            POLAR map client won't render.
            Retrying in ${waitTime}ms ...`
        )
        counter++
      } else {
        clearInterval(intervalId)

        const shadowRoot = buildShadowDom(shadowHost, containerId)

        // Monkey patch querySelector to properly find shadowRoot element
        const { querySelector } = document
        document.querySelector = function (selector) {
          if (selector === '[data-app]') return shadowRoot
          return querySelector.call(this, selector)
        }

        resolve(shadowRoot)
      }
    })
  })
