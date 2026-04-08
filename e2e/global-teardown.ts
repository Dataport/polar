/**
 * Playwright global teardown — stops the mock map server after the test suite.
 *
 * Referenced from playwright.config.ts via `globalTeardown`.
 */
import { MockMapServerManager } from './mock-map-server'

async function globalTeardown(): Promise<void> {
  const manager = MockMapServerManager.getInstance()
  await manager.stop()
}

export default globalTeardown
