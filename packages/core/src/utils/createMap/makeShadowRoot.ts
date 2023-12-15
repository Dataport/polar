const waitTime = 500
const maxAttempts = 10

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

        const shadowRoot = shadowHost.attachShadow({ mode: 'open' })

        // Monkey patch querySelector to properly find root element
        const { querySelector } = document
        document.querySelector = function (selector) {
          if (selector === '[data-app]') return shadowRoot
          return querySelector.call(this, selector)
        }

        resolve(shadowRoot)
      }
    })
  })
