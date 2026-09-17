import type { ReceivedRequest } from '../mock-map-server'

import { createBdd } from 'playwright-bdd'

import { expect, test } from '../fixtures'
import {
	LAYER_CHOOSER_BUTTON_LABEL,
	LAYER_CHOOSER_ENTRY_SELECTOR,
	MOCK_MAP_LAYER_NAME,
} from '../support/selectors'

const { When, Then } = createBdd(test)

/**
 * Stores captured BBOX tile widths keyed by `"<clientUuid>:<label>"`.
 * Scoping by client UUID prevents scenarios that reuse the same label
 * (e.g. "before zoom") from reading a stale value left by an earlier
 * scenario running in the same worker.
 */
const capturedTileWidths: Record<string, number> = {}

/**
 * Builds the storage key used to scope a captured tile width to a client.
 *
 * @param clientUuid - UUID of the test client that captured the width.
 * @param label - Human-readable label for the captured width.
 * @returns The composite storage key.
 */
function tileWidthKey(clientUuid: string, label: string): string {
	return `${clientUuid}:${label}`
}

/**
 * Parses a BBOX query parameter and returns the geographic width of the tile.
 * BBOX format is `minX,minY,maxX,maxY`.
 *
 * @param bbox - Raw BBOX string from the WMS GetMap query parameter.
 * @returns The tile width as 'maxX - minX'.
 * @throws Error when the BBOX is missing coordinates or not numeric.
 */
function parseBboxWidth(bbox: string | undefined): number {
	const [minX, minY, maxX, maxY] = (bbox?.split(',') ?? []).map(Number)
	if (
		minX === undefined ||
		minY === undefined ||
		maxX === undefined ||
		maxY === undefined ||
		[minX, minY, maxX, maxY].some(Number.isNaN)
	) {
		throw new Error(
			`[mock-map-service] Malformed BBOX "${bbox}": expected ` +
				`"minX,minY,maxX,maxY" with numeric values`
		)
	}
	return maxX - minX
}

/**
 * Clears all expectations and recorded requests for this test client mid-test.
 * Useful when a scenario needs to reset mock state after earlier interactions.
 */
When('the mock map server state is reset', async function ({ mockMap }) {
	await mockMap.clearClientState()
})

/**
 * Registers a persistent catch-all expectation for mock WMS GetMap requests.
 * Matched requests will receive a green tile; the expectation is logged.
 */
When(
	'a WMS GetMap expectation is registered for the mock layer',
	async function ({ mockMap }) {
		const clientUuid = mockMap.getUuid()
		await mockMap.expect(
			{
				url: '/wms',
				query: {
					REQUEST: 'GetMap',
					SERVICE: 'WMS',
					LAYERS: 'mock',
					testClientUuid: clientUuid,
				},
			},
			undefined,
			{ persistent: true }
		)
	}
)

/**
 * Registers a single-use (non-persistent) expectation for mock WMS GetMap requests.
 * Only the first matching request receives a green tile; the expectation is
 * consumed afterwards, so subsequent requests fall through to the blue fallback.
 */
When(
	'a single-use WMS GetMap expectation is registered for the mock layer',
	async function ({ mockMap }) {
		const clientUuid = mockMap.getUuid()
		await mockMap.expect(
			{
				url: '/wms',
				query: {
					REQUEST: 'GetMap',
					SERVICE: 'WMS',
					LAYERS: 'mock',
					testClientUuid: clientUuid,
				},
			},
			undefined,
			{ persistent: false }
		)
	}
)

/**
 * Opens the layer chooser panel via the icon menu.
 * The snowbox client opens it on startup, so the step only clicks when needed.
 */
When('the layer chooser is opened', async function ({ page }) {
	const entries = page.locator(LAYER_CHOOSER_ENTRY_SELECTOR).first()

	if (!(await entries.isVisible())) {
		await page
			.getByRole('button', { name: LAYER_CHOOSER_BUTTON_LABEL, exact: true })
			.click()
	}

	await expect(entries).toBeVisible()
})

/**
 * Selects the mock map basemap in the layer chooser panel.
 */
When('the mock map basemap is selected', async function ({ page }) {
	const radio = page.getByRole('radio', {
		name: MOCK_MAP_LAYER_NAME,
		exact: true,
	})
	await expect(radio).toBeVisible({ timeout: 30_000 })
	await radio.check()
})

/**
 * Asserts that at least one WMS GetMap request was sent to the mock map service.
 * Polls for up to 5 seconds to allow tiles to load after basemap switch.
 */
Then(
	'WMS GetMap requests should have been sent to the mock map service',
	async function ({ mockMap }) {
		const clientUuid = mockMap.getUuid()
		const match = await mockMap.waitForRequest(
			(req) =>
				req.query.REQUEST === 'GetMap' &&
				req.query.SERVICE === 'WMS' &&
				req.query.LAYERS === 'mock' &&
				req.query.testClientUuid === clientUuid,
			{ timeout: 5000 }
		)
		expect(
			match,
			'Expected at least one WMS GetMap request to the mock map service, ' +
				'but none arrived within 5 s'
		).not.toBeNull()
	}
)

/**
 * Asserts that at least one WMS GetMap request was received that did NOT match
 * any expectation (i.e. it fell through to the blue fallback tile).
 * Polls for up to 5 seconds.
 */
Then(
	'subsequent WMS GetMap requests should return the blue fallback tile',
	async function ({ mockMap }) {
		const clientUuid = mockMap.getUuid()
		const unmatchedReq = await mockMap.waitForRequest(
			(req) =>
				req.query.REQUEST === 'GetMap' &&
				req.query.SERVICE === 'WMS' &&
				req.query.LAYERS === 'mock' &&
				req.query.testClientUuid === clientUuid &&
				!req.matched,
			{ timeout: 5000 }
		)
		expect(
			unmatchedReq,
			'Expected at least one unmatched WMS GetMap request (blue fallback), ' +
				'but none arrived within 5 s'
		).not.toBeNull()
	}
)

/**
 * Returns a base predicate matching WMS GetMap requests for the mock layer
 * that belong to the given client and contain a BBOX parameter.
 *
 * @param clientUuid - UUID of the test client to scope the predicate.
 * @returns A predicate function filtering relevant WMS GetMap requests.
 */
function wmsBboxPredicate(clientUuid: string): (r: ReceivedRequest) => boolean {
	return (r) =>
		r.query.REQUEST === 'GetMap' &&
		r.query.LAYERS === 'mock' &&
		r.query.testClientUuid === clientUuid &&
		r.query.BBOX !== undefined
}

/**
 * Saves the BBOX tile width from the most recent WMS GetMap request under
 * a named label so it can be compared with a later capture.
 *
 * @param label - A human-readable label used to store the tile width (e.g. "before zoom").
 */
Then(
	'the WMS tile width is saved as {string}',
	async function ({ mockMap }, label: string) {
		const clientUuid = mockMap.getUuid()
		const match = await mockMap.waitForRequestOrFail(
			wmsBboxPredicate(clientUuid),
			{
				message: `No WMS GetMap request with BBOX found when saving "${label}"`,
			}
		)
		capturedTileWidths[tileWidthKey(clientUuid, label)] = parseBboxWidth(
			match.query.BBOX
		)
	}
)

/**
 * Polls until a WMS GetMap request arrives whose BBOX tile width is strictly
 * smaller than a previously saved value. This bakes the assertion into the
 * wait, avoiding timing issues with zoom animations.
 *
 * @param referenceLabel - Label of the previously saved tile width to compare against.
 * @param targetLabel - Label under which the smaller tile width is saved.
 */
Then(
	'a WMS request with tile width smaller than {string} is saved as {string}',
	async function ({ mockMap }, referenceLabel: string, targetLabel: string) {
		const clientUuid = mockMap.getUuid()
		const reference =
			capturedTileWidths[tileWidthKey(clientUuid, referenceLabel)]
		if (reference === undefined) {
			throw new Error(`"${referenceLabel}" was not captured`)
		}

		const match = await mockMap.waitForRequestOrFail(
			(r) =>
				wmsBboxPredicate(clientUuid)(r) &&
				parseBboxWidth(r.query.BBOX) < reference,
			{
				timeout: 10000,
				message:
					`No WMS GetMap request with BBOX width smaller than ` +
					`"${referenceLabel}" (${reference}) found within timeout`,
			}
		)
		capturedTileWidths[tileWidthKey(clientUuid, targetLabel)] = parseBboxWidth(
			match.query.BBOX
		)
	}
)

/**
 * Polls until a WMS GetMap request arrives whose BBOX tile width is strictly
 * larger than a previously saved value. This bakes the assertion into the
 * wait, avoiding timing issues with zoom animations.
 *
 * @param referenceLabel - Label of the previously saved tile width to compare against.
 * @param targetLabel - Label under which the larger tile width is saved.
 */
Then(
	'a WMS request with tile width larger than {string} is saved as {string}',
	async function ({ mockMap }, referenceLabel: string, targetLabel: string) {
		const clientUuid = mockMap.getUuid()
		const reference =
			capturedTileWidths[tileWidthKey(clientUuid, referenceLabel)]
		if (reference === undefined) {
			throw new Error(`"${referenceLabel}" was not captured`)
		}

		const match = await mockMap.waitForRequestOrFail(
			(r) =>
				wmsBboxPredicate(clientUuid)(r) &&
				parseBboxWidth(r.query.BBOX) > reference,
			{
				timeout: 10000,
				message:
					`No WMS GetMap request with BBOX width larger than ` +
					`"${referenceLabel}" (${reference}) found within timeout`,
			}
		)
		capturedTileWidths[tileWidthKey(clientUuid, targetLabel)] = parseBboxWidth(
			match.query.BBOX
		)
	}
)

/**
 * Clears recorded requests so the next capture only sees fresh traffic.
 */
When(
	'the recorded mock map requests are cleared',
	async function ({ mockMap }) {
		await mockMap.clearReceivedRequests()
	}
)
