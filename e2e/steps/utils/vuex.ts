import type { Page } from '@playwright/test'

export async function dispatch(
  page: Page,
  action: string,
  payload?: unknown
): Promise<void> {
  await page.evaluate(
    ([dispatchAction, dispatchPayload]) => {
      const mapInstance = (
        window as typeof window & {
          mapInstance?: {
            $store?: {
              dispatch: (type: string, data?: unknown) => unknown
            }
          }
        }
      ).mapInstance

      if (!mapInstance?.$store?.dispatch) {
        throw new Error('window.mapInstance.$store.dispatch is not available')
      }

      mapInstance.$store.dispatch(dispatchAction, dispatchPayload)
    },
    [action, payload] as const
  )
}