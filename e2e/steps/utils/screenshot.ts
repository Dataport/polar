import type { TestInfo } from '@playwright/test'

import { promises as fs } from 'fs'
import { join } from 'path'

import { DEBUG_SCREENSHOTS } from '../../support/config'

const SCREENSHOTS_DIR = join(process.cwd(), 'test-results', 'debug-screenshots')

/**
 * Sanitises a string so it can safely be used as a directory or file name.
 * Replaces characters that are invalid in file-system paths with dashes and
 * collapses consecutive dashes. Trailing dots and spaces are dropped because
 * Windows silently strips them from path segments, which breaks later reads.
 */
function sanitise(name: string): string {
	return name
		.replace(/[<>:"/\\|?*]+/g, '-')
		.replace(/-{2,}/g, '-')
		.replace(/^-|-$/g, '')
		.trim()
		.replace(/[. ]+$/, '')
}

/**
 * Extracts the feature name and scenario name from Playwright's TestInfo.
 *
 * playwright-bdd populates `testInfo.titlePath` as:
 *   `['', '<Feature title>', '<Scenario title>']`
 * or with a project prefix:
 *   `['<project>', '<Feature title>', '<Scenario title>']`
 */
export function extractBddNames(testInfo: TestInfo): {
	featureName: string
	scenarioName: string
} {
	const path = testInfo.titlePath
	// Scenario title is always the last element
	const scenarioName = sanitise(path[path.length - 1] ?? 'unknown-scenario')
	// Feature title is the second-to-last element (skip project / root entries)
	const featureName = sanitise(path[path.length - 2] ?? 'unknown-feature')
	return { featureName, scenarioName }
}

/**
 * Ensures the screenshots directory exists.
 */
async function ensureDir(dir: string): Promise<void> {
	try {
		await fs.mkdir(dir, { recursive: true })
	} catch (error) {
		console.error('Failed to create screenshots directory:', error)
	}
}

/**
 * Saves a screenshot buffer to disk with a timestamp.
 *
 * @param buffer - The screenshot buffer to save
 * @param name - Base name for the screenshot (e.g., 'before-click', 'after-click')
 * @param testInfo - Optional Playwright TestInfo for feature/scenario directory structure
 * @returns The path where the file was saved, or null if save failed
 */
export async function saveScreenshot(
	buffer: Buffer,
	name: string,
	testInfo?: TestInfo
): Promise<string | null> {
	try {
		const timestamp = Date.now()
		let dir = SCREENSHOTS_DIR

		if (testInfo) {
			const { featureName, scenarioName } = extractBddNames(testInfo)
			dir = join(SCREENSHOTS_DIR, featureName, scenarioName)
		}

		await ensureDir(dir)
		const filename = `${name}-${timestamp}.png`
		const filepath = join(dir, filename)
		await fs.writeFile(filepath, buffer)
		return filepath
	} catch (error) {
		console.error(`Failed to save screenshot '${name}':`, error)
		return null
	}
}

interface PinsScreenshotContext {
	afterClickClip?: Buffer
	beforeCenterClip?: Buffer
	beforeClickClip?: Buffer
	loadingCenterClip?: Buffer
	stabilizedCenterClip?: Buffer
}

/**
 * Writes a set of named image buffers into one timestamped debug directory.
 *
 * When `testInfo` is provided the directory structure is:
 *   `debug-screenshots/<feature_name>/<scenario_name>/<testName>-<timestamp>/`
 *
 * @param images - Image buffers keyed by file name (without extension).
 * @param testName - Name of the test for file organization.
 * @param testInfo - Optional Playwright TestInfo for feature/scenario directory structure.
 */
export async function saveDebugScreenshots(
	images: Record<string, Buffer | undefined>,
	testName: string,
	testInfo?: TestInfo
): Promise<void> {
	try {
		const timestamp = Date.now()
		let baseDir = SCREENSHOTS_DIR

		if (testInfo) {
			const { featureName, scenarioName } = extractBddNames(testInfo)
			baseDir = join(SCREENSHOTS_DIR, featureName, scenarioName)
		}

		const testDir = join(baseDir, `${testName}-${timestamp}`)
		await ensureDir(testDir)

		for (const [name, buffer] of Object.entries(images)) {
			if (buffer) {
				await fs.writeFile(join(testDir, `${name}.png`), buffer)
			}
		}

		console.warn(`Debug screenshots saved to: ${testDir}`)
	} catch (error) {
		console.error('Failed to save debug screenshots:', error)
	}
}

/**
 * Runs an assertion and writes its debug images on failure — or on every run
 * when `E2E_DEBUG_SCREENSHOTS` is enabled.
 *
 * @param assertion - The comparison to guard.
 * @param save - Callback persisting the images belonging to the assertion.
 */
export async function withDebugScreenshots(
	assertion: () => void,
	save: () => Promise<void>
): Promise<void> {
	try {
		assertion()
	} catch (error) {
		await save()
		throw error
	}

	if (DEBUG_SCREENSHOTS) {
		await save()
	}
}

/**
 * Saves all screenshots from the pins context.
 * Useful for debugging failed assertions.
 *
 * @param pinsContext - The pins object containing all screenshots
 * @param testName - Name of the test for file organization
 * @param testInfo - Optional Playwright TestInfo for feature/scenario directory structure
 */
export async function saveAllPinsScreenshots(
	pinsContext: PinsScreenshotContext | undefined,
	testName: string,
	testInfo?: TestInfo
): Promise<void> {
	if (!pinsContext) {
		return
	}

	await saveDebugScreenshots(
		{
			beforeCenterClip: pinsContext.beforeCenterClip,
			beforeClickClip: pinsContext.beforeClickClip,
			afterClickClip: pinsContext.afterClickClip,
			loadingCenterClip: pinsContext.loadingCenterClip,
			stabilizedCenterClip: pinsContext.stabilizedCenterClip,
		},
		testName,
		testInfo
	)
}
