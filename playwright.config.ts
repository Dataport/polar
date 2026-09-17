import { defineConfig, devices } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { cucumberReporter, defineBddConfig } from 'playwright-bdd'

import { CLIENT_BASE_URL, DEBUG_SCREENSHOTS } from './e2e/support/config.js'

// Parse client from environment variable set by run-e2e.js script
const getClient = () => {
	// eslint-disable-next-line no-console
	console.log('PLAYWRIGHT_CLIENT:', process.env.PLAYWRIGHT_CLIENT)
	if (process.env.PLAYWRIGHT_CLIENT) {
		return process.env.PLAYWRIGHT_CLIENT
	}
	return null // null means all clients
}

const client = getClient()
const validClients = ['generic', 'iceberg', 'snowbox']

if (client && !validClients.includes(client)) {
	console.error(
		`Invalid client: ${client}. Valid options: ${validClients.join(', ')}`
	)
	process.exit(1)
}

// eslint-disable-next-line no-console
console.log(
	client
		? `Running tests for client: ${client}`
		: 'Running tests for all clients'
)

const url = CLIENT_BASE_URL
const clientsFeaturePath = 'e2e/features/clients/'
const featureSuffix = '/*.feature'
const clientsStepsPath = 'e2e/steps/clientSpecific/'
const stepsSuffix = '*.ts'

// If no client specified, include all features and steps
const features = client
	? [`${clientsFeaturePath}${client}${featureSuffix}`]
	: [`${clientsFeaturePath}*${featureSuffix}`]

const steps = [
	'e2e/fixtures.ts',
	`e2e/steps/${stepsSuffix}`,
	`${clientsStepsPath}*/${stepsSuffix}`, // Alle client-spezifischen Steps
]

const testDir = defineBddConfig({
	features,
	steps,
})

const globalSetup = fileURLToPath(
	new URL('./e2e/global-setup.ts', import.meta.url)
)
const globalTeardown = fileURLToPath(
	new URL('./e2e/global-teardown.ts', import.meta.url)
)

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir,

	/* Start/stop the mock map server for the entire suite */
	globalSetup,
	globalTeardown,

	/* Run tests in files in parallel */
	fullyParallel: true,

	/* Maximum time each test can run for. */
	timeout: 90_000,

	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,

	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,

	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,

	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: [
		cucumberReporter('html', {
			outputFile: 'cucumber-report/index.html',
			externalAttachments: true,
		}),
		['html', { open: 'never' }],
		// Use a client-specific file name so blob reports from different matrix
		// jobs don't collide when merged into a single directory in CI.
		[
			'blob',
			{
				outputDir: 'blob-report',
				fileName: client ? `report-${client}.zip` : undefined,
			},
		],
	],

	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: url,

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		// trace: 'on-first-retry',
		trace: 'on',

		screenshot: DEBUG_SCREENSHOTS ? 'on' : 'only-on-failure',
	},
	webServer: {
		// All examples are served by a single vite dev server; see `CLIENT_ENTRY_PATHS`.
		command: 'npm run serve:e2e',
		url,
		timeout: 120 * 1000,
		reuseExistingServer: !process.env.CI,
		stdout: 'ignore',
		// The `enrichedConsole` vite plugin pipes all browser console output here.
		stderr: 'ignore',
	},
	projects: [
		// {
		//   name: 'chromium',
		//   use: { ...devices['Desktop Chrome'] },
		// },
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},
		// {
		//   name: 'webkit',
		//   use: { ...devices['Desktop Safari'] },
		// },
		// {
		//   name: 'Mobile Chrome',
		//   use: { ...devices['Pixel 5'] },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: { ...devices['iPhone 12'] },
		// },
	],
})
