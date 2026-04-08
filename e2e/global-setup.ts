/**
 * Playwright global setup — starts the mock map server before the test suite.
 *
 * Referenced from playwright.config.ts via `globalSetup`.
 */
import { MockMapServerManager } from './mock-map-server'

async function globalSetup(): Promise<void> {
  const manager = MockMapServerManager.getInstance()
  await manager.start()
}

export default globalSetup
