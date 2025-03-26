import { Page } from '@playwright/test'

export const openDiPlan = async (page: Page) => {
  // @ts-expect-error | it's manually added in snowbox client
  const watchReadiness = page.waitForFunction(() => Boolean(window.mapInstance))
  await page.goto('./example/diplan-ui-one/')
  await watchReadiness
}
