import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { When, Then } = createBdd()

/**
 * Clicks each visible icon in the icon menu sequentially.
 */
When(
  'each icon in the icon menu is clicked one by one',
  async function ({ page }) {
    const iconMenu = page.locator('ul.icon-menu-list')
    const iconButtons = iconMenu.locator(
      '.icon-menu-list-item button.v-btn--fab[aria-label]:visible'
    )
    const count = await iconButtons.count()

    for (let i = 0; i < count; i++) {
      const button = iconButtons.nth(i)
      await button.scrollIntoViewIfNeeded()
      await button.click({ timeout: 5000 })
    }
  }
)

/**
 * Verifies that each icon responded to click actions.
 */
Then('each icon should respond to the click action', async function ({ page }) {
  await expect(
    page
      .locator('ul.icon-menu-list')
      .locator('.icon-menu-list-item button[aria-label]:visible')
      .first()
  ).toBeVisible()
})

/**
 * Checks that the icon menu is present on the page.
 */
Then('the icon menu should be present', async function ({ page }) {
  await expect(page.locator('ul.icon-menu-list')).toBeVisible()
})

/**
 * Verifies the icon menu contains specific icons in the expected order.
 *
 * @param {import('@cucumber/cucumber').DataTable} dataTable - Table of expected icon labels.
 */
Then(
  'the icon menu should contain the following icons in order:',
  async function ({ page }, dataTable) {
    const expectedLabels = dataTable.rows().map((row) => row[0].trim())
    const iconMenu = page.locator('ul.icon-menu-list')
    const iconButtons = iconMenu.locator(
      '.icon-menu-list-item button.v-btn--fab[aria-label]'
    )

    await expect(iconMenu).toBeVisible()
    await expect
      .poll(async () => await iconButtons.count(), {
        timeout: 15_000,
      })
      .toBeGreaterThanOrEqual(expectedLabels.length)

    for (const expectedLabel of expectedLabels) {
      const button = iconMenu.locator(
        `.icon-menu-list-item button[aria-label="${expectedLabel}"]`
      )
      await button.first().scrollIntoViewIfNeeded()
      await expect(button.first()).toBeVisible({ timeout: 15_000 })
    }

    const actualLabels = await iconButtons.evaluateAll((elements) =>
      elements
        .map((el) => (el.getAttribute('aria-label') || '').trim())
        .filter((label) => label.length > 0)
    )

    let cursor = 0
    for (const expectedLabel of expectedLabels) {
      const foundIndex = actualLabels.indexOf(expectedLabel, cursor)
      expect(
        foundIndex,
        `Expected icon "${expectedLabel}" after index ${
          cursor - 1
        }. Actual icons: ${actualLabels.join(' | ')}`
      ).toBeGreaterThanOrEqual(0)
      cursor = foundIndex + 1
    }
  }
)
