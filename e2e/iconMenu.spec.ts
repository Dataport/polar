import { test, expect, Page } from '@playwright/test'
import { openSnowbox } from './utils/openSnowbox'

const expectOpenContentWindows = async (page: Page, amount: number) =>
  expect(await page.locator('.icon-menu-list-item-content')).toHaveCount(amount)

test('opens and closes children exclusively to each other', async ({
  page,
}) => {
  await openSnowbox(page)

  // one window open initially
  await expectOpenContentWindows(page, 1)

  // window closed
  await page.locator('.icon-menu-list-item button').first().click()
  await expectOpenContentWindows(page, 0)

  // window reopened
  await page.locator('.icon-menu-list-item button').first().click()
  await expectOpenContentWindows(page, 1)

  // opening another window closes the first one
  await page.locator('.icon-menu-list-item:nth-child(2) button').first().click()
  await expectOpenContentWindows(page, 1)
})
