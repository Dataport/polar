/**
 * Playwright Test Runner
 * This script is responsible for running Playwright tests on their respective clients concurrently.
 * It first starts the test clients, then runs the Playwright tests with the specified arguments, and finally stops all clients.
 */
import { exec } from 'child_process'
import { parseArgs } from 'node:util'
import { Logger, ILogObj } from 'tslog'
import { startTestClients, stopTestClients } from './playwright-client-runner'
import type { Client, RunningClient } from './playwright-client-runner'

const log: Logger<ILogObj> = new Logger({ name: 'PlaywrightTestRunner' })
const { values } = parseArgs({
  options: {
    clients: {
      type: 'string',
      short: 'c',
      multiple: true,
      defaultValue: [],
      description: '',
    },
    tags: {
      type: 'string',
      short: 't',
      multiple: true,
      defaultValue: [],
      description: '',
    },
    ignore_tags: {
      type: 'string',
      short: 'i',
      multiple: true,
      defaultValue: [],
      description: '',
    },
  },
})

const CLIENTS: string[] = Array.from(new Set(values.clients))
const INCLUDE_TAGS: Set<string> = new Set(values.tags)
const EXCLUDE_TAGS: Set<string> = new Set(values.ignore_tags)
const CLIENT_TEST_REPORT_PATHS: string[] = []

const REPORT_DIR = 'playwright-report'

function mergePlaywrightReports(): Promise<void> {
  log.info('Merging Playwright test reports...')
  return new Promise((resolve, reject) => {
    exec(
      `npx playwright merge-reports ${CLIENT_TEST_REPORT_PATHS.join(
        ' '
      )} ${REPORT_DIR}/merged-report`,
      (error, stdout, stderr) => {
        if (error) {
          log.error(`Error merging Playwright reports: ${stderr}`)
          reject(error)
        } else {
          log.info(`Playwright reports merged successfully: ${stdout}`)
          resolve()
        }
      }
    )
  })
}

function buildGrepExpression(clientTag: string): string {
  const clientRegex = `(?=.*${clientTag})`
  const includeRegex =
    [...INCLUDE_TAGS].length > 0 ? `(?=.*(${[...INCLUDE_TAGS].join('|')}))` : ''
  const excludeRegex =
    [...EXCLUDE_TAGS].length > 0 ? `(?!.*(${[...EXCLUDE_TAGS].join('|')}))` : ''
  return `--grep ^${excludeRegex}${clientRegex}${includeRegex}`
}

function startPlaywrightTest(client: Client): Promise<void> {
  const grepExpression = buildGrepExpression(client.packageName)
  return new Promise<void>((resolve, reject) => {
    // beispiel für webbrowser --project=chromium
    const reportPath = `${REPORT_DIR}/clients/${client.name}`
    CLIENT_TEST_REPORT_PATHS.push(reportPath)
    // const execExpression = `npx playwright test --reporter=blob --output=${reportPath} ${grepClientExpression} ${GREP_EXPRESSION} ${GREP_INVERT_EXPRESSION}`
    const execExpression = `npx playwright test --reporter=blob ${grepExpression}`
    log.info(
      `Starting Playwright tests for client on port ${client.port} with command: ${execExpression}`
    )
    const testProcess = exec(execExpression, {
      env: {
        ...process.env,
        BASE_URL: `http://localhost:${client.port}`,
      },
    })

    testProcess.stdout?.on('data', (data: string) => {
      log.info(`Playwright test output: ${data}`)
    })

    testProcess.stderr?.on('data', (data: string) => {
      log.error(`Playwright test error: ${data}`)
    })

    testProcess.on('exit', (code: number) => {
      if (code === 0) {
        log.info(
          `Playwright tests finished successfully for client on port ${client.port}`
        )
        resolve()
      } else {
        log.error(
          `Playwright tests failed with exit code ${code} for client on port ${client.port}`
        )
        reject(new Error(`Playwright tests failed with exit code ${code}`))
      }
    })
  })
}

async function startTestsOnClients() {
  try {
    const runningClients: RunningClient[] = await startTestClients(CLIENTS)
    // Run Playwright tests here
    await Promise.all(
      runningClients.map(async (runningClient: RunningClient) => {
        const client = runningClient.client
        try {
          await startPlaywrightTest(client)
          log.info(`Tests completed for client ${client.packageName}`)
        } catch (error) {
          log.error(
            `Error running tests for client ${client.packageName}:`,
            error
          )
        }
      })
    )
    log.info('All Playwright tests completed.')
    stopTestClients()
    try {
      await mergePlaywrightReports()
    } catch (error) {
      log.error('Error merging Playwright reports:', error)
    }
  } catch (error) {
    log.error('Error while starting test clients:', error)
    stopTestClients()
  }
}

if (require.main === module) {
  // Handle graceful shutdown
  ;['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) => {
    process.on(signal, () => {
      log.warn(`Received ${signal}, closing all clients...`)
      stopTestClients()
      process.exit(0)
    })
  })

  // Start the Playwright tests with the provided arguments
  startTestsOnClients()
    .then(() => {
      log.info('Playwright test runner completed successfully.')
      process.exit(0)
    })
    .catch((error) => {
      log.error('Playwright test runner encountered an error:', error)
      process.exit(1)
    })
}
