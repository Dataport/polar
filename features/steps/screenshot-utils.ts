import { promises as fs } from 'fs'
import { join } from 'path'

const SCREENSHOTS_DIR = join(
  process.cwd(),
  'test-results',
  'pins-debug-screenshots'
)

/**
 * Ensures the screenshots directory exists.
 */
async function ensureScreenshotsDir(): Promise<void> {
  try {
    await fs.mkdir(SCREENSHOTS_DIR, { recursive: true })
  } catch (error) {
    console.error('Failed to create screenshots directory:', error)
  }
}

/**
 * Saves a screenshot buffer to disk with a timestamp.
 *
 * @param buffer - The screenshot buffer to save
 * @param name - Base name for the screenshot (e.g., 'before-click', 'after-click')
 * @returns The path where the file was saved, or null if save failed
 */
export async function saveScreenshot(
  buffer: Buffer,
  name: string
): Promise<string | null> {
  try {
    await ensureScreenshotsDir()
    const timestamp = Date.now()
    const filename = `${name}-${timestamp}.png`
    const filepath = join(SCREENSHOTS_DIR, filename)
    await fs.writeFile(filepath, buffer)
    return filepath
  } catch (error) {
    console.error(`Failed to save screenshot '${name}':`, error)
    return null
  }
}

/**
 * Saves all screenshots from the pins context on test failure.
 * Useful for debugging failed assertions.
 *
 * @param pinsContext - The pins object containing all screenshots
 * @param testName - Name of the test for file organization
 */
export async function saveAllPinsScreenshots(
  pinsContext: any,
  testName: string
): Promise<void> {
  if (!pinsContext) return

  try {
    await ensureScreenshotsDir()
    const timestamp = Date.now()
    const testDir = join(SCREENSHOTS_DIR, `${testName}-${timestamp}`)
    await fs.mkdir(testDir, { recursive: true })

    const screenshots: Record<string, Buffer | undefined> = {
      beforeCenterClip: pinsContext.beforeCenterClip,
      beforeClickClip: pinsContext.beforeClickClip,
      afterClickClip: pinsContext.afterClickClip,
      loadingCenterClip: pinsContext.loadingCenterClip,
      stabilizedCenterClip: pinsContext.stabilizedCenterClip,
    }

    for (const [name, buffer] of Object.entries(screenshots)) {
      if (buffer) {
        const filepath = join(testDir, `${name}.png`)
        await fs.writeFile(filepath, buffer)
      }
    }

    console.log(`Pins screenshots saved to: ${testDir}`)
  } catch (error) {
    console.error('Failed to save pins screenshots on failure:', error)
  }
}
