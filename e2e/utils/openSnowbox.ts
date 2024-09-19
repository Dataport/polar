import { Page } from '@playwright/test'

export const openSnowbox = async (page: Page) => {
  // @ts-expect-error | it's manually added in snowbox client
  const watchReadiness = page.waitForFunction(() => Boolean(window.mapInstance))
  await page.goto('http://127.0.0.1:8080/dist/index.html')
  await watchReadiness
}
