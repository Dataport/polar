import { Page } from '@playwright/test'

export const clickTimes = async ({
  page,
  value,
  times,
  method = 'getByLabel',
}: {
  page: Page
  value: string
  times: number
  method?: string
}) => {
  for (let i = 0; i < times; i++) {
    await page[method](value).click()
  }
}
