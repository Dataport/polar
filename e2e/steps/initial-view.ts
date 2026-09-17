import { createBdd } from 'playwright-bdd'

import { INITIAL_VIEW_LABEL } from '../support/selectors'

const { When } = createBdd()

/**
 * Resets the map to the view configured by the client.
 */
When('the return to initial view button is clicked', async function ({ page }) {
	await page
		.getByRole('button', { name: INITIAL_VIEW_LABEL, exact: true })
		.click()
})
