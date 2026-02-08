// eslint-disable-next-line @typescript-eslint/no-var-requires
import { defineBddConfig, cucumberReporter } from 'playwright-bdd'
import { defineConfig, devices } from '@playwright/test'

// Parse client from environment variable set by run-e2e.js script
const getClient = () => {
  console.log('PLAYWRIGHT_CLIENT:', process.env.PLAYWRIGHT_CLIENT)
  if (process.env.PLAYWRIGHT_CLIENT) {
    return process.env.PLAYWRIGHT_CLIENT
  }
  return null // null means all clients
}

const client = getClient()
const validClients = [
  'afm',
  'bgw',
  'diplan',
  'dish',
  'generic',
  'meldemichel',
  'snowbox',
  'stylePreview',
  'textLocator',
]

if (client && !validClients.includes(client)) {
  console.error(
    `Invalid client: ${client}. Valid options: ${validClients.join(', ')}`
  )
  process.exit(1)
}

console.log(
  client
    ? `Running tests for client: ${client}`
    : 'Running tests for all clients'
)

const url = 'http://127.0.0.1:8080'
const clientsFeaturePath = 'features/clients/'
const featureSuffix = '/*.feature'
const clientsStepsPath = 'features/steps/clientSpecific/'
const stepsSuffix = '*.ts'

// If no client specified, include all features and steps
const features = client
  ? [`${clientsFeaturePath}${client}${featureSuffix}`]
  : [`${clientsFeaturePath}*${featureSuffix}`]

const steps = [
  `features/steps/${stepsSuffix}`,
  `${clientsStepsPath}*/${stepsSuffix}`, // Alle client-spezifischen Steps
]

const testDir = defineBddConfig({
  features,
  steps,
})

/**
 * See https://playwright.dev/docs/test-configuration.
 */
module.exports = {
  default: defineConfig({
    testDir,
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Maximum time each test can run for. */
    timeout: 60_000,
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
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
      /* Base URL to use in actions like `await page.goto('/')`. */
      baseURL: url,

      /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
      // trace: 'on-first-retry',
      trace: 'on',

      screenshot: 'only-on-failure',
    },
    webServer: {
      command: `npm run ${client}:build:serve:e2e`,
      url,
      timeout: 10 * 1000,
      reuseExistingServer: !process.env.CI,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    projects: [
      // {
      //   name: 'chromium',
      //   use: { ...devices['Desktop Chrome'] },
      // },
      // {
      //   name: 'firefox',
      //   use: { ...devices['Desktop Firefox'] },
      // },
      // {
      //   name: 'webkit',
      //   use: { ...devices['Desktop Safari'] },
      // },
      // {
      //   name: 'Mobile Chrome',
      //   use: { ...devices['Pixel 5'] },
      // },
      {
        name: 'Mobile Safari',
        use: { ...devices['iPhone 12'] },
      },
    ],
  }),
}
