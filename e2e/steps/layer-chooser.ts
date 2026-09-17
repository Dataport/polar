import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

import {
	ACTIVE_BACKGROUND_STATE_SELECTOR,
	LAYER_CHOOSER_BUTTON_LABEL,
	LAYER_CHOOSER_ENTRY_SELECTOR,
	MAP_CANVAS_SELECTOR,
} from '../support/selectors'
import {
	getBackgroundRenderState,
	getSelectedLayerId,
	setBackgroundRenderState,
	setSelectedLayerId,
} from './context'
import { waitForNetworkIdle } from './utils/network'
import { saveDebugScreenshots, withDebugScreenshots } from './utils/screenshot'

const { Given, When, Then } = createBdd()

const backgroundRadios = (page: Page): Locator =>
	page.locator(LAYER_CHOOSER_ENTRY_SELECTOR).getByRole('radio')

const backgroundRadio = (page: Page, layerId: string): Locator =>
	page.locator(
		`${LAYER_CHOOSER_ENTRY_SELECTOR} input[type="radio"][value="${layerId}"]`
	)

/** Edge length of the downscaled map rendering used for comparisons. */
const FINGERPRINT_SIZE = 64

/**
 * Reads the pixels OpenLayers painted instead of taking a page screenshot.
 *
 * Toasts and the loading indicator are rendered into the map's middle regions,
 * so a cropped page screenshot would compare overlays rather than map content.
 * Downscaling keeps the comparison cheap and ignores sub-pixel tile seams.
 */
const mapFingerprint = (page: Page): Promise<string> =>
	page
		.locator(MAP_CANVAS_SELECTOR)
		.first()
		.evaluate((canvas, size) => {
			const target = document.createElement('canvas')
			target.width = size
			target.height = size

			const context = target.getContext('2d')
			if (context === null) {
				throw new Error('Could not acquire a 2d context for downscaling')
			}

			context.drawImage(canvas as HTMLCanvasElement, 0, 0, size, size)
			return target.toDataURL('image/png')
		}, FINGERPRINT_SIZE)

/**
 * Captures the map rendering once tile loading and fade-in animations settled,
 * so comparisons are not taken mid-render.
 */
async function stableMapFingerprint(page: Page): Promise<string> {
	await waitForNetworkIdle(page)

	let previous = await mapFingerprint(page)

	for (let attempt = 0; attempt < 10; attempt += 1) {
		await page.waitForTimeout(250)
		const current = await mapFingerprint(page)
		if (current === previous) {
			return current
		}
		previous = current
	}

	return previous
}

const fingerprintToPng = (fingerprint: string): Buffer =>
	Buffer.from(fingerprint.replace(/^data:image\/png;base64,/, ''), 'base64')

const activeBackgroundId = async (page: Page): Promise<string> => {
	const text = await page
		.locator(ACTIVE_BACKGROUND_STATE_SELECTOR)
		.textContent()
	return JSON.parse(text ?? 'null') as string
}

/**
 * Opens the layer chooser panel.
 *
 * The snowbox client configures `initiallyOpen: 'layerChooser'`, so an
 * unconditional click would close the panel instead of opening it.
 */
When('the layer chooser button is clicked', async function ({ page }) {
	const entries = page.locator(LAYER_CHOOSER_ENTRY_SELECTOR).first()

	if (!(await entries.isVisible())) {
		await page
			.getByRole('button', { name: LAYER_CHOOSER_BUTTON_LABEL, exact: true })
			.click()
	}

	await expect(entries).toBeVisible()
})

/**
 * Stores the currently active background layer together with the pixels the map
 * currently shows, which later steps compare against.
 */
Given('the rendered map is remembered', async function ({ page }) {
	setBackgroundRenderState(page, {
		initialBackgroundId: await activeBackgroundId(page),
		fingerprint: await stableMapFingerprint(page),
	})
})

/**
 * Switches to the first selectable background layer that is not active yet and
 * remembers it for the follow-up assertion.
 */
When('a new layer is selected', async function ({ page }) {
	const radios = backgroundRadios(page)
	await expect(radios.first()).toBeVisible({ timeout: 30_000 })

	for (const radio of await radios.all()) {
		if ((await radio.isChecked()) || !(await radio.isEnabled())) {
			continue
		}

		const id = await radio.inputValue()
		await radio.check()
		setSelectedLayerId(page, id)
		return
	}

	throw new Error(
		'The layer chooser offers no selectable background layer besides the active one.'
	)
})

/**
 * Restores the background layer that was active when the baseline was taken.
 */
When(
	'the previously active background layer is selected again',
	async function ({ page }) {
		const { initialBackgroundId } = getBackgroundRenderState(page)
		await backgroundRadio(page, initialBackgroundId).check()
	}
)

/**
 * Verifies the chosen background became the active one.
 * [WARNING] This step relies on the plugin state debug view of the example page.
 */
Then('the map should display the selected layer', async function ({ page }) {
	const layerId = getSelectedLayerId(page)

	await expect(page.locator(ACTIVE_BACKGROUND_STATE_SELECTOR)).toHaveText(
		JSON.stringify(layerId)
	)
	await expect(backgroundRadio(page, layerId)).toBeChecked()
})

/**
 * Proves the switch reached the canvas: the map has to be painted differently
 * than before.
 */
Then(
	'the rendered map should differ from the remembered one',
	async function ({ page, $testInfo }) {
		const { fingerprint } = getBackgroundRenderState(page)
		const current = await stableMapFingerprint(page)

		await withDebugScreenshots(
			() => {
				expect(
					current,
					'Expected the map to be rendered differently after the background layer switch'
				).not.toEqual(fingerprint)
			},
			() =>
				saveDebugScreenshots(
					{
						remembered: fingerprintToPng(fingerprint),
						afterSwitch: fingerprintToPng(current),
					},
					'background-layer-switched',
					$testInfo
				)
		)
	}
)

/**
 * Proves switching back restores the original rendering instead of leaving the
 * map on the previously selected background.
 */
Then(
	'the rendered map should match the remembered one',
	async function ({ page, $testInfo }) {
		const { fingerprint, initialBackgroundId } = getBackgroundRenderState(page)

		await expect(page.locator(ACTIVE_BACKGROUND_STATE_SELECTOR)).toHaveText(
			JSON.stringify(initialBackgroundId)
		)

		const current = await stableMapFingerprint(page)

		await withDebugScreenshots(
			() => {
				expect(
					current,
					'Expected the map to be rendered as before after switching back to the initial background layer'
				).toEqual(fingerprint)
			},
			() =>
				saveDebugScreenshots(
					{
						remembered: fingerprintToPng(fingerprint),
						afterSwitchBack: fingerprintToPng(current),
					},
					'background-layer-restored',
					$testInfo
				)
		)
	}
)
