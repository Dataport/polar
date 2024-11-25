/* eslint-env node */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const cp = require('child_process')

const packages = process.argv.slice(2).map((tag) => tag.split('@')[1])

for (const packageName of packages) {
  try {
    cp.execSync(
      `npx nx release publish --projects @${packageName} --verbose false`,
      { stdio: ['pipe', 'ignore', 'pipe'] }
    )
  } catch (e) {
    console.error(e)
    process.exitCode = 1
  }
}
