import { test, expect, Page } from '@playwright/test'
import { openSnowbox } from './utils/openSnowbox'

const expectOpenContentWindows = async (page: Page, amount: number) =>
  expect(await page.locator('.icon-menu-list-item-content')).toHaveCount(amount)

test('opens and closes children exclusively to each other', async ({
  page,
  isMobile,
}) => {
  await openSnowbox(page)

  // mobile ignores `initiallyOpen` by design, hence we open it manually to have the same start as on Desktop
  if (isMobile) {
    await page.locator('.icon-menu-list-item button').first().click()
  }

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
